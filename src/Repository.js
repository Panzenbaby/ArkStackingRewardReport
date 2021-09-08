const utils = require('./utils')

class Repository {

    constructor() {
        this.profile = walletApi.profiles.getCurrent()
        this.address = ''
        this.transactions = []
        this.votes = []
        this.prices = []
        this.stackingRewards = []
    }

    async changeAddress(address) {
        this.address = address
        await this.loadData()
    }

    async debug(address) {
        this.address = address
        const path = `wallets/${this.address}/transactions/received?limit=100`
        const response = await this.getAllPagesOf(path)
        return response[0].timestamp.unix
    }

    async loadData() {
        this.transactions = await this.getTransactions()
        this.votes = await this.getVotes()

        const comparator = (lhs, rhs) => lhs.date - rhs.date
        this.transactions.sort(comparator)
        this.votes.sort(comparator)

        const transactionsMap = new Map()
        this.transactions.forEach(transaction => {
            const year = walletApi.utils.datetime(transaction.date * 1000).format('YYYY')
            if (!transactionsMap.get(year)) {
                transactionsMap.set(year, [])
            }
            transactionsMap.get(year).push(transaction)
        })

        this.stackingRewards = []
        for (const entry of transactionsMap.entries()) {
            const transaction = entry[1]
            await this.loadPrices(transaction)
            await this.applyPrices(transaction)
            Array.prototype.push.apply(this.stackingRewards, this.getStackingRewards(transaction, this.votes))
            // TODO put the stacking rewards into a year map as well to show the selected year only
        }

        this.stackingRewards.sort((lhs, rhs) => rhs.date - lhs.date)
    }

    async getTransactions() {
        const path = `wallets/${this.address}/transactions/received?limit=100`
        let response = await this.getAllPagesOf(path)

        const result = []
        try {
            response.forEach(transaction => {
                const type = parseInt(transaction.type)
                const date = transaction.timestamp.unix
                const senderPublicKey = transaction.senderPublicKey

                let amount = 0.0
                switch (type) {
                    case 0:
                        amount = parseFloat(transaction.amount)
                        break;
                    case 6:
                        const payments = transaction.asset.payments
                        payments.forEach(payment => {
                            if (payment.recipientId === this.address) {
                                amount = parseFloat(payment.amount)
                            }
                        })
                        break;
                }

                amount = amount / 100000000
                result.push({
                    amount: amount,
                    date: date,
                    senderPublicKey: senderPublicKey,
                })
            })
        } catch (error) {
            walletApi.alert.error(error.message)
        }
        return result
    }

    async getVotes() {
        const path = `wallets/${this.address}/votes?limit=100`
        let response = await this.getAllPagesOf(path)

        const result = []
        try {
            response.forEach(transaction => {
                    const date = transaction.timestamp.unix
                    const vote = transaction.asset.votes[0]
                    const isDownVote = vote[0] === '-'
                    const delegatePublicKey = vote.substr(1, vote.length)
                    result.push({
                        delegatePublicKey: delegatePublicKey,
                        date: date,
                        isDownVote: isDownVote
                    })
                }
            )
        } catch (error) {
            walletApi.alert.error(error.message)
        }

        return result
    }

    async getAllPagesOf(requestPath) {
        try {
            let page = 1
            let data = []
            let result = []
            do {
                let response = await walletApi.peers.current.get(requestPath + `&page=${page}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                data = response.data
                Array.prototype.push.apply(result, data)
                page++
            } while (data && data.length > 0)

            return result
        } catch (error) {
            walletApi.alert.error(error.message)
        }
    }

    getStackingRewards(transactions, votes) {
        let result = []
        let lastVoteTime = votes[votes.length - 1].date
        let since = 0
        while (since < lastVoteTime) {
            const res = this.getStackingRewardsSince(transactions, votes, since)
            Array.prototype.push.apply(result, res.result)
            since = res.downVoteTime
        }

        return result
    }

    getStackingRewardsSince(transactions, votes, since) {
        const result = []
        const upVote = votes.find(vote => !vote.isDownVote && since < vote.date)
        const downVote = votes.find(vote => vote.isDownVote && vote.delegatePublicKey === upVote.delegatePublicKey)

        let downVoteTime = Date.now()
        if (downVote) {
            downVoteTime = downVote.date
        }

        transactions.forEach(transaction => {
            if (upVote.date <= transaction.date && transaction.date < downVoteTime
                && transaction.senderPublicKey === upVote.delegatePublicKey) {
                result.push(transaction)
            }
        })

        return {result: result, downVoteTime: downVoteTime}
    }

    async loadPrices(transactions) {
        if (transactions.length > 0) {
            const lastTransactionTime = this.transactions[this.transactions.length - 1].date
            const fromTime = Math.round(this.transactions[0].date)
            const query = {
                fsym: this.profile.network.token,
                tsym: this.profile.currency,
                toTs: lastTransactionTime,
                limit: utils.days_since(fromTime)
            }

            const {body} = await walletApi.http.get('https://min-api.cryptocompare.com/data/histoday', {
                query: query,
                json: true
            })

            Array.prototype.push.apply(this.prices, body.Data)
        }
    }

    async applyPrices(transactions) {
        transactions.map(transaction => {
            const time = transaction.date
            const price = this.prices.find(price => {
                return time >= price.time && time < (price.time + utils.secondsOfDay)
            })

            let closePrice = undefined
            if (price !== undefined) {
                closePrice = price.close
            }
            Object.assign(transaction, {closePrice: closePrice})
        })
    }
}

module.exports = Repository