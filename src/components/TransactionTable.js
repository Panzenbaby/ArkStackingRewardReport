const utils = require('../utils')

module.exports = {
    template: `
    <span>
        <span>Found {{transactions.length}} transactions with stacking rewards</span>
        
        <TableWrapper
            class="w-full"
            :rows="transactions"
            :columns="columns"
            :has-pagination="false"
            :has-pagination="true"
        >
            <template slot-scope="data" >
                <span v-if="data.column.field === 'date'">
                    {{ formatTime(data.row.date) }}
                </span>
                <span v-else-if="data.column.field === 'amount'">
                    {{ getAmountValue(data.row) }}
                </span>
                <span v-else-if="data.column.field === 'closePrice'">
                    {{ getPriceValue(data.row) }}
                </span>
            </template>
        </TableWrapper>
    </span>
  `,

    props: {
        transactions: {
            type: Array,
            required: true
        }
    },

    computed: {
        columns() {
            return [
                {
                    label: `${this.profile.network.token} Amount`,
                    field: 'amount',
                    sortable: false,
                    type: 'number',
                    thClass: 'whitespace-no-wrap'
                },
                {
                    label: `${this.profile.currency} Value`,
                    field: `closePrice`,
                    sortable: false,
                    thClass: `whitespace-no-wrap`
                },
                {
                    label: 'Date',
                    field: 'date',
                    sortable: true,
                    tdClass: 'whitespace-no-wrap'
                },
                {
                    label: `From`,
                    field: 'senderPublicKey',
                    sortable: false,
                    thClass: 'whitespace-no-wrap'
                }
            ]
        },

        profile() {
            return walletApi.profiles.getCurrent()
        }
    },

    methods: {
        formatTime(time) {
            return utils.format_time(time, this.profile.language)
        },

        getPriceValue(transaction) {
            if (!transaction.closePrice) {
                return "NaN"
            }

            const value = transaction.amount * transaction.closePrice
            const currency = this.profile.currency
            const language = this.profile.language
            return utils.formatter_currency(value, currency, language)
        },

        getAmountValue(transaction) {
            if (!transaction.amount) {
                return "NaN"
            }

            const value = transaction.amount
            const currency = this.profile.network.token
            const language = this.profile.language
            return utils.formatter_currency(value, currency, language)
        }
    }
}