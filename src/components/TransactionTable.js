const utils = require('../utils')

module.exports = {
    template: `
    <span>
        <TableWrapper
            class="w-full"
            :rows="transactions"
            :columns="columns"
            :per-page="25"
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
                <span v-else-if="data.column.field === 'delegateName'">
                    <a
                        v-if="true"
                        v-tooltip="{
                            content: data.row.senderPublicKey,
                            trigger: 'hover'
                        }"
                        target="_blank"
                        :href="[profile.network.explorer, 'wallets', data.row.senderPublicKey].join('/')" >
                        
                        <span>
                            {{ data.row.delegateName }}
                        </span>
                    </a>
                </span>
                <span v-else-if="data.column.field === 'transactionId'">
                    <a
                        v-if="true"
                        v-tooltip="{
                            content: 'Show in Explorer',
                            trigger: 'hover'
                        }"
                        target="_blank"
                        :href="[profile.network.explorer, 'transaction', data.row.transactionId].join('/')" >
                        
                        <span>
                            {{ data.row.transactionId }}
                        </span>
                    </a>
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
                    sortable: false,
                    tdClass: 'whitespace-no-wrap'
                },
                {
                    label: `From`,
                    field: 'delegateName',
                    sortable: false,
                    thClass: 'whitespace-no-wrap'
                },
                {
                    label: `Transaction ID`,
                    field: 'transactionId',
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
            return utils.formatTime(this.profile, time)
        },

        getPriceValue(transaction) {
            return utils.getPriceValue(this.profile, transaction)
        },

        getAmountValue(transaction) {
            return utils.getAmountValue(this.profile, transaction)
        }
    }
}