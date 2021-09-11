// Part of this file is a copy of https://github.com/dated/delegate-calculator-plugin/blob/master/src/components/Header.js
const utils = require('../utils')
const InfoIcon = require('../../images/infoIcon')
const Keys = require('../Keys')

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
          
          <span class="font-bold mt-1">
            {{ formatCurrency(wallet.balance, profile.network.token) }}
          </span>
        </div>
      </div>
        
      <div
          v-if="!isLoading" 
          class="flex flex-row">
            
          <div class="flex flex-col border-l border-theme-line-separator px-12" >
              <span class="text-sm text-theme-page-text-light font-semibold mb-1">
                  Period
              </span>
    
              <MenuDropdown
                  ref="period"
                  :disabled="isLoading"
                  :items="years"
                  :value="selectedYear"
                  container-classes="whitespace-no-wrap"
                  @select="onYearChanged" />
          </div>
            
          <div
            v-if="rewardSum" 
            class="flex flex-col border-l border-theme-line-separator px-12" >
          
            <span class="text-sm text-theme-page-text-light font-semibold mb-1">
                  Received Stacking Rewards
            </span>
            
            <span class="font-bold text-green">
                  {{ formatCurrency(rewardSum, profile.currency) }}
            </span>
          </div>
            
          <div class="flex items-center" >
            
            <button
                class="ContactAll__CreateButton mr-4"
                @click="onReloadClicked">
                  
                <span class="ContactAll__CreateButton__icon">
                    
                    <SvgIcon
                        name="reload"
                        view-box="0 0 15 15"
                    />
                 </span>
            </button>
          </div>
            
          <div class="flex items-center" >
          
              <button
                  class="ContactAll__CreateButton mr-4"
                  @click="onExportClicked">
                  
                  <span class="ContactAll__CreateButton__icon">
                  
                      <SvgIcon
                          name="arrow-export"
                          view-box="0 0 15 15"
                      />
                  </span>
              </button>
          </div>
          
          <div class="flex items-center" >
          
              <button
                  class="ContactAll__CreateButton mr-4"
                  @click="onInfoClicked">
                  
                  <span class="ContactAll__CreateButton__icon">
                  
                      <InfoIcon view-box="0 0 15 15"/>
                  </span>
              </button>
          </div>
      </div>
        
      <div v-else class="flex flex-col border-l border-theme-line-separator px-12" >
           <span class="text-sm text-theme-page-text-light font-semibold mb-1">
              Period
          </span>
          <span class="font-semibold">
              {{ selectedYear }}
          </span>
      </div>
    </div>
  `,

    components: {
        InfoIcon
    },

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
        rewardSum: {
            type: Number,
            required: false
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
        emitAddressChange(address) {
            this.callback(Keys.EVENT_ADDRESS_CHANGED, {address})
        },

        onYearChanged(year) {
            this.callback(Keys.EVENT_YEAR_CHANGED, {year})
        },

        onReloadClicked() {
            this.callback(Keys.EVENT_RELOAD)
        },

        onExportClicked() {
            this.callback(Keys.EVENT_EXPORT)
        },

        onInfoClicked() {
            this.callback(Keys.EVENT_INFO)
        },

        formatCurrency(value, currency) {
            return utils.formatter_currency(value, currency, this.profile.language)
        },
    }
}