const Header = require('../components/Header')
const Footer = require('../components/Footer')
const TransactionTable = require('../components/TransactionTable')
const DisclaimerModal = require('../components/DisclaimerModal')
const InfoModal = require('../components/InfoModal')
const Repository = require('../data/Repository')
const utils = require('../utils')
const Keys = require('../Keys')
const Strings = require('../Strings')

module.exports = {

    template: `
      <div class="flex flex-col flex-1 overflow-y-auto">
      
        <div
            v-if="error"
            class="relative flex flex-col flex-1 justify-center items-center rounded-lg bg-theme-feature">
            
                <span class="font-bold" style="font-size:20pt">{{ errorTitleLabel }}</span>
                <span class="font-bold text-red mt-6 mb-6" style="font-size:16pt">
                    {{ error.message }}
                </span>
                
                <button
                  class="ContactAll__CreateButton justify-end"
                  @click="onRetryClicked"
                >
                  <span class="flex items-center h-10 px-4 whitespace-no-wrap">
                    {{ retryLabel }}
                  </span>
                </button>
        </div>
        <div
            v-else-if="!hasWallets"
            class="relative flex flex-col flex-1 justify-center items-center rounded-lg bg-theme-feature" >
                
                <img
                    class="mb-5"
                    src="https://raw.githubusercontent.com/Panzenbaby/ArkStackingRewardReport/master/images/logo.png" >
                
                <span class="mb-5">{{ noWalletMessage }}</span>

                <button
                    class="flex items-center text-blue hover:underline"
                    @click="openWalletImport" >
                        {{ walletImportNow }}
                </button>
        </div>
      
        <div v-else-if="wallet" class="flex flex-col flex-1 overflow-y-hidden" >
      
          <Header
            :wallet="wallet"
            :isLoading="isLoading"
            :selectedYear="year"
            :years="selectableYears"
            :rewardSum="rewardSum"
            :callback="handleHeaderEvent"
          />

          <div class="flex flex-col flex-1 p-10 rounded-lg bg-theme-feature overflow-y-auto">
            <div class="flex flex-1">
              <div
                v-if="isLoading"
                class="relative flex items-center mx-auto w-md"
              >
                <div class="mx-auto">
                  <Loader />
                </div>
              </div>

              <div
               v-else
                class="w-full"
              >
                <TransactionTable
                  :transactions="repository.stackingRewardsMap.get(year)"
                />
              </div>
            </div>
          </div>
        </div>
      
        <Footer/>
        
        <DisclaimerModal
            v-if="!hasAcceptedDisclaimer"
            :callback="handleDisclaimerModalEvent"/>
            
        <InfoModal
            v-if="showInfoModal"
            :callback="closeInfoModal"/>
      </div>
    `,

    components: {
        Header,
        Footer,
        TransactionTable,
        DisclaimerModal,
        InfoModal
    },

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },

        hasWallets() {
            const wallets = this.profile.wallets
            return !!(wallets && wallets.length)
        },

        hasAcceptedDisclaimer() {
            return walletApi.storage.get(Keys.KEY_HAS_ACCEPT_DISCLAIMER)
        },
    },

    data: () => ({
        address: '',
        isLoading: false,
        wallet: {
            address: '',
        },
        year: '',
        selectableYears: [],
        rewardSum: undefined,
        repository: new Repository(),
        showInfoModal: false,
        error: undefined,
        noWalletMessage: '',
        walletImportNow: '',
        errorTitleLabel: '',
        retryLabel: ''
    }),

    async mounted() {
        this.year = walletApi.utils.datetime(Date.now()).format('YYYY')
        this.address = walletApi.storage.get(Keys.KEY_ADDRESS)

        this.noWalletMessage = Strings.getString(this.profile, Strings.NO_WALLET_MESSAGE)
        this.walletImportNow = Strings.getString(this.profile, Strings.WALLET_IMPORT_NOW)
        this.errorTitleLabel = Strings.getString(this.profile, Strings.ERROR_TITLE)
        this.retryLabel = Strings.getString(this.profile, Strings.RETRY)
    },

    watch: {
        address: function (address) {
            this.onAddressChanged(address)
        },

        profile: function () {
            // refresh data due the currency could have changed
            this.updatePrices()
        }
    },

    methods: {

        openWalletImport() {
            walletApi.route.goTo(Keys.WALLET_IMPORT)
        },

        async handleHeaderEvent(event, options) {
            switch (event) {
                case Keys.EVENT_ADDRESS_CHANGED:
                    this.setAddress(options.address)
                    break;
                case Keys.EVENT_YEAR_CHANGED:
                    this.onYearChanged(options.year)
                    break;
                case Keys.EVENT_RELOAD:
                    this.reload()
                    break;
                case Keys.EVENT_EXPORT:
                    await this.onExport()
                    break;
                case Keys.EVENT_INFO:
                    this.showInfoModal = true
                    break;
            }
        },

        setAddress(address) {
            this.address = address
            walletApi.storage.set(Keys.KEY_ADDRESS, this.address)
        },

        onAddressChanged(address) {
            this.updateWallet()
            if (this.wallet.address !== address) {
                // fixed bug after deleting selected address from wallet
                if (this.wallet) {
                    this.setAddress(this.wallet.address)
                } else {
                    this.address = undefined
                    return
                }
            }

            this.isLoading = true
            this.repository.changeAddress(address).then(() => {
                if (address === this.address) {
                    // only change the view data if the selected address has not changed since the execution
                    this.selectableYears = Array.from(this.repository.stackingRewardsMap.keys())
                    this.year = this.selectableYears[this.selectableYears.length - 1]
                    this.updateCurrentRewardSum()
                    this.isLoading = false
                }
            }).catch((error) => {
                this.error = error
            })
        },

        onYearChanged(year) {
            this.year = year
            this.updateCurrentRewardSum()
        },

        reload() {
            this.onAddressChanged(this.address)
        },

        async updatePrices() {
            this.isLoading = true
            await this.repository.updatePrices()
            this.updateCurrentRewardSum()
            this.isLoading = false
        },

        onRetryClicked() {
            this.error = undefined
            this.reload()
        },

        closeInfoModal() {
            this.showInfoModal = false
        },

        updateWallet() {
            const wallets = this.profile.wallets
            this.wallet = wallets.find(wallet => wallet.address === this.address)

            if (!this.wallet) {
                if (wallets.length > 0) {
                    this.wallet = wallets[0]
                } else {
                    walletApi.alert.error("Didn't find any wallet")
                }
            }
        },

        updateCurrentRewardSum() {
            const curreny = this.profile.currency
            let sum = 0.0
            this.repository.stackingRewardsMap.get(this.year).forEach(transaction => {
                let tokens = transaction.amount
                if (!utils.isCrypto(curreny)) {
                    tokens = tokens / utils.tokenValueFactor
                }
                sum = sum + tokens * transaction.closePrice
            })
            this.rewardSum = sum
        },

        handleDisclaimerModalEvent(event) {
            switch (event) {
                case Keys.CANCEL:
                    walletApi.route.goTo(Keys.WALLET_DASHBOARD)
                    break
                case Keys.CONFIRM:
                    walletApi.storage.set(Keys.KEY_HAS_ACCEPT_DISCLAIMER, true)
                    break;
            }
        },

        async onExport() {
            const rows = []
            const amount = Strings.getString(this.profile, Strings.TABLE_HEADER_AMOUNT)
            const value = Strings.getString(this.profile, Strings.TABLE_HEADER_VALUE)
            const date = Strings.getString(this.profile, Strings.TABLE_HEADER_DATE)
            const transactionId = Strings.getString(this.profile, Strings.TABLE_HEADER_TRANSACTION)
            const header = `${this.profile.network.token} ${amount} | ${this.profile.currency} ${value} | ${date} | ${transactionId}`
            rows.push(header)

            this.repository.stackingRewardsMap.get(this.year).forEach(transaction => {
                rows.push(utils.buildExportRow(this.profile, transaction))
            })

            try {
                const asString = rows.join("\n")
                const fileName = `stacking_reward_report_${this.address}_${this.year}.csv`
                const filePath = await walletApi.dialogs.save(asString, fileName, 'csv')

                if (filePath) {
                    const message = Strings.getString(this.profile, Strings.EXPORT_SUCCESS)
                    walletApi.alert.success(message + ` ${filePath}`)
                }
            } catch (error) {
                walletApi.alert.error(error)
            }
        },
    }
}