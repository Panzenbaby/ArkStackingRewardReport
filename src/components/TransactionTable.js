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
        >
            <template slot-scope="data" >
                <span v-if="data.column.field === 'date'">
                    {{ formatTime(data.row.date) }}
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
        }
    }
}