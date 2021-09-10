// Some code from this is a copy of https://github.com/dated/delegate-calculator-plugin/blob/master/src/utils.js

const secondsOfDay = 24 * 60 * 60
const millisecondsOfDay = secondsOfDay * 1000

const tokenValueFactor = 1e8

module.exports = {
    secondsOfDay: secondsOfDay,
    millisecondsOfDay: millisecondsOfDay,
    tokenValueFactor: tokenValueFactor,

    formatter_currency: (value, currency, language = 'en') => {
        const isCrypto = currency => {
            return ['ARK', 'BTC', 'ETH', 'LTC'].includes(currency)
        }

        if (isCrypto(currency)) {
            value = Number(value) / tokenValueFactor
        }

        return Number(value).toLocaleString(language, {
            style: 'currency',
            currencyDisplay: 'code',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: isCrypto(currency) ? 8 : 2
        })
    },

    formatTime(profile, time) {
        return new Date(time * 1000).toLocaleDateString(profile.language)
    },

    days_since: (fromTime) => {
        let endDate = Date.now() / 1000
        return Math.round(Math.abs(((fromTime) - endDate) / secondsOfDay))
    },

    getPriceValue(profile, transaction) {
        if (!transaction.closePrice) {
            return "NaN"
        }

        const tokens = transaction.amount / this.tokenValueFactor
        const value = tokens * transaction.closePrice
        const currency = profile.currency
        const language = profile.language
        return this.formatter_currency(value, currency, language)
    },

    getAmountValue(profile, transaction) {
        if (!transaction.amount) {
            return "NaN"
        }

        const value = transaction.amount
        const currency = profile.network.token
        const language = profile.language
        return this.formatter_currency(value, currency, language)
    },

    buildExportRow(profile, transaction) {
        const amount = this.getAmountValue(profile, transaction)
        const value = this.getPriceValue(profile, transaction)
        const date = this.formatTime(profile, transaction.date)
        const transactionId = transaction.transactionId
        return `${amount} | ${value} | ${date} | ${transactionId}`
    },
}
