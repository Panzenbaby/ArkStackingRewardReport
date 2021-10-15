const RemoteDataStore = require('./RemoteDataStore')
const utils = require('../utils')

class Repository {

    dateComparator = (lhs, rhs) => lhs.date - rhs.date
    dateComparatorDesc = (lhs, rhs) => rhs.date - lhs.date

    constructor() {
        this.profile = walletApi.profiles.getCurrent()
        this.remoteDataStore = new RemoteDataStore(this.profile)
        this.address = ''
        this.votes = []
        this.transactionsMap = new Map()
        this.stakingRewardsMap = new Map()
    }

    async changeAddress(executionPermission, address) {
        try {
            this.profile = walletApi.profiles.getCurrent()
            this.address = address
            await this.loadData(executionPermission)
            return executionPermission
        } catch (error) {
            throw new ExecutionError(executionPermission, error.message, error.stack)
        }
    }

    async loadData(executionPermission) {
        const transactions = await this.remoteDataStore.getTransactions(executionPermission, this.address)
        this.votes = await this.remoteDataStore.getVotes(executionPermission, this.address)

        transactions.sort(this.dateComparator)
        this.votes.sort(this.dateComparator)

        this.transactionsMap = new Map()
        transactions.forEach(transaction => {
            const year = walletApi.utils.datetime(transaction.date * 1000).format('YYYY')
            if (!this.transactionsMap.get(year)) {
                this.transactionsMap.set(year, [])
            }
            this.transactionsMap.get(year).push(transaction)
        })

        await this.updatePrices()
    }

    async updatePrices() {
        this.stakingRewardsMap = new Map()

        for (const entry of this.transactionsMap.entries()) {
            const year = entry[0]
            const transaction = entry[1]

            const prices = await this.remoteDataStore.loadPrices(transaction)
            await this.applyPrices(transaction, prices)

            const rewards = this.remoteDataStore.getStakingRewards(transaction, this.votes)
            rewards.sort(this.dateComparatorDesc)
            this.stakingRewardsMap.set(year, rewards)
        }
    }

    async applyPrices(transactions, prices) {
        transactions.map(transaction => {
            const time = transaction.date
            const price = prices.find(price => {
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

class ExecutionError extends Error {

    constructor(executionPermission, message, stack) {
        super(message);
        this.stack = stack;
        this.executionPermission = executionPermission;
    }
}

module.exports = Repository
