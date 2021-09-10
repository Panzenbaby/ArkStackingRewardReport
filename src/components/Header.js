// This is a copy of https://github.com/dated/delegate-calculator-plugin/blob/master/src/components/Header.js
const utils = require('../utils')

module.exports = {
    template: `
    <div class="flex w-full items-center mb-3 py-8 px-10 rounded-lg bg-theme-feature">
      <div
        v-if="wallet"
        class="flex items-center"
      >
        <WalletIdenticon
          :value="wallet.address"
          :size="50"
          class="flex-inline mr-4"
        />

        <div class="flex flex-col pr-12">
          <span class="text-sm text-theme-page-text-light font-semibold mb-1">
            Address
          </span>

          <MenuDropdown
            ref="address"
            :items="addresses"
            :value="wallet.address"
            :pin-to-input-width="true"
            @select="emitAddressChange"
          />
        </div>
        
        <div
            v-if="!isLoading"
            class="flex flex-col border-l border-theme-line-separator px-12"
        >
            <span class="text-sm text-theme-page-text-light font-semibold mb-1">
                Period
            </span>

            <MenuDropdown
                ref="period"
                :disabled="isLoading"
                :items="years"
                :value="selectedYear"
                container-classes="whitespace-no-wrap"
                @select="onYearChanged"
            />
        </div>
        <div v-else class="flex flex-col border-l border-theme-line-separator px-12" >
             <span class="text-sm text-theme-page-text-light font-semibold mb-1">
                Period
            </span>
            <span class="font-semibold">
                {{ selectedYear }}
            </span>
        </div>

        <div class="flex flex-col border-l border-theme-line-separator px-12">
          <span class="text-sm text-theme-page-text-light font-semibold mb-1">
            Balance
          </span>

          <span class="font-semibold">
            {{ formatCurrency(wallet.balance, 'ARK') }}
          </span>
        </div>
      </div>
    </div>
  `,

    props: {
        wallet: {
            type: Object,
            required: true
        },
        isLoading: {
            type: Boolean,
            required: true
        },
        selectedYear: {
            type: String,
            required: true
        },
        years: {
            type: Object,
            required: true
        },
        callback: {
            type: Function,
            required: true
        }
    },

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },

        addresses() {
            return this.profile.wallets.map(wallet => wallet.address)
        }
    },

    methods: {
        executeCallback(event, options) {
            this.callback({
                component: 'Header',
                event,
                options
            })
        },

        emitAddressChange(address) {
            this.executeCallback('addressChange', {address})
        },

        onYearChanged(year) {
            this.executeCallback('yearChange', {year})
        },

        formatCurrency(value, currency) {
            const balance = Number(value) / 1e8
            return utils.formatter_currency(balance, currency, this.profile.language)
        }
    }
}