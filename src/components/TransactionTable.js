const utils = require('../utils')
const Strings = require("../Strings");

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
                        v-tooltip="{
                            content: showInExplorer,
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
                    label: `${this.profile.network.token} ${this.amountLabel}`,
                    field: 'amount',
                    sortable: false,
                    type: 'number',
                    thClass: 'whitespace-no-wrap'
                },
                {
                    label: `${this.profile.currency} ${this.valueLabel}`,
                    field: `closePrice`,
                    sortable: false,
                    thClass: `whitespace-no-wrap`
                },
                {
                    label: this.dateLabel,
                    field: 'date',
                    sortable: false,
                    tdClass: 'whitespace-no-wrap'
                },
                {
                    label: this.fromLabel,
                    field: 'delegateName',
                    sortable: false,
                    thClass: 'whitespace-no-wrap'
                },
                {
                    label: this.transactionLabel,
                    field: 'transactionId',
                    sortable: false,
                    thClass: 'whitespace-no-wrap'
                }
            ]
        },

        profile() {
            return walletApi.profiles.getCurrent()
        },

        valueLabel() {
            return Strings.getString(this.profile, Strings.TABLE_HEADER_VALUE)
        },
        amountLabel() {
            return Strings.getString(this.profile, Strings.TABLE_HEADER_AMOUNT)
        },
        dateLabel() {
            return Strings.getString(this.profile, Strings.TABLE_HEADER_DATE)
        },
        fromLabel() {
            return Strings.getString(this.profile, Strings.TABLE_HEADER_FROM)
        },
        transactionLabel() {
            return Strings.getString(this.profile, Strings.TABLE_HEADER_TRANSACTION)
        },
        showInExplorer() {
            return Strings.getString(this.profile, Strings.SHOW_IN_EXPLORER)
        },
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
    },
}