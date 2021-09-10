const RemoteDataStore = require('./RemoteDataStore')
const utils = require('../utils')

class Repository {

    constructor() {
        this.profile = walletApi.profiles.getCurrent()
        this.remoteDataStore = new RemoteDataStore(this.profile)
        this.address = ''
        this.transactions = []
        this.votes = []
        this.prices = []
        this.stackingRewards = []
        this.stackingRewardsMap = new Map()
    }

    async changeAddress(address) {
        this.profile = walletApi.profiles.getCurrent()
        this.address = address
        await this.loadData()
    }

    async loadData() {
        const comparator = (lhs, rhs) => lhs.date - rhs.date
        const comparatorDesc = (lhs, rhs) => rhs.date - lhs.date

        this.transactions = await this.remoteDataStore.getTransactions(this.address)
        this.votes = await this.remoteDataStore.getVotes(this.address)

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
        this.stackingRewardsMap = new Map()
        for (const entry of transactionsMap.entries()) {
            const year = entry[0]
            const transaction = entry[1]

            this.prices = await this.remoteDataStore.loadPrices(transaction)
            await this.applyPrices(transaction)

            const rewards = this.remoteDataStore.getStackingRewards(transaction, this.votes)
            rewards.sort(comparatorDesc)
            Array.prototype.push.apply(this.stackingRewards, rewards)
            this.stackingRewardsMap.set(year, rewards)
        }

        this.stackingRewards.sort(comparatorDesc)
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