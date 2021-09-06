class Repository {

    constructor() {
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

        const comparator = (ls, rs) => ls.date - rs.date
        this.transactions.sort(comparator)
        this.votes.sort(comparator)

        this.stackingRewards = this.getStackingRewards(this.transactions, this.votes)
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
}

module.exports = Repository