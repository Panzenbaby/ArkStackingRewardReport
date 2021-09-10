// This is a copy of https://github.com/dated/delegate-calculator-plugin/blob/master/src/utils.js

const secondsOfDay = 24 * 60 * 60
const millisecondsOfDay = secondsOfDay * 1000

module.exports = {
    secondsOfDay: secondsOfDay,
    millisecondsOfDay: millisecondsOfDay,

    formatter_currency: (value, currency, language = 'en') => {
        const isCrypto = currency => {
            return ['ARK', 'BTC', 'ETH', 'LTC'].includes(currency)
        }

        if (isCrypto(value)) {
            value = Number(value) / 1e8
        }

        return Number(value).toLocaleString(language, {
            style: 'currency',
            currencyDisplay: 'code',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: isCrypto(currency) ? 8 : 2
        })
    },

    format_time: (time, language) => {
        return new Date(time * 1000).toLocaleDateString(language)
    },

    days_since: (fromTime) => {
        let endDate = Date.now() / 1000
        return Math.round(Math.abs(((fromTime) - endDate) / secondsOfDay))
    }
}
