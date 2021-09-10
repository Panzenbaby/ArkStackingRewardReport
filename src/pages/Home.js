const Header = require('../components/Header')
const Footer = require('../components/Footer')
const TransactionTable = require('../components/TransactionTable')
const Repository = require('../data/Repository')
const utils = require('../utils')

module.exports = {

    template: `
      <div class="flex flex-col flex-1 overflow-y-auto">
        <div
            v-if="!hasWallets"
            class="relative flex flex-col flex-1 justify-center items-center rounded-lg bg-theme-feature" >
                <p class="mb-5">
                    Your profile has no wallets yet.
                </p>

                <button
                    class="flex items-center text-blue hover:underline"
                    @click="openWalletImport" >
                        Import a wallet now
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
          
          <div v-if="debugMessage">
            <span class="text-theme-footer-text">
                {{ debugMessage }}
            </span>
          </div>
        </div>
      </div>
      
      <Footer/>
      </div>
    `,

    components: {
        Header,
        Footer,
        TransactionTable
    },

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },

        hasWallets() {
            const wallets = this.profile.wallets
            return !!(wallets && wallets.length)
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
        debugMessage: '',
        repository: new Repository()

    }),

    async mounted() {
        this.year = walletApi.utils.datetime(Date.now()).format('YYYY')
        this.address = walletApi.storage.get('address')
    },

    watch: {
        address: function (address) {
            this.onAddressChanged(address)
        }
    },

    methods: {

        openWalletImport() {
            walletApi.route.goTo('wallet-import')
        },

        async handleHeaderEvent({component, event, options}) {
            switch (event) {
                case "addressChange":
                    this.setAddress(options.address)
                    break;
                case "yearChange":
                    this.onYearChanged(options.year)
                    break;
                case "reload":
                    this.reload()
                    break;
                case "export":
                    await this.onExport()
                    break;
            }
        },

        setAddress(address) {
            this.address = address
            walletApi.storage.set('address', this.address)
        },

        onAddressChanged(address) {
            this.updateWallet()
            if (this.wallet.address !== address) {
                // fixed bug after deleting selected address from wallet
                this.setAddress(this.wallet.address)
            }

            this.isLoading = true
            this.repository.changeAddress(address).then(() => {
                if (address === this.address) {
                    // only change the view data if the selected address has not changed since the execution
                    this.selectableYears = Array.from(this.repository.stackingRewardsMap.keys())
                    this.updateCurrentRewardSum()
                    this.isLoading = false
                }
            })
        },

        onYearChanged(year) {
            this.year = year
            this.updateCurrentRewardSum()
        },

        reload() {
            this.onAddressChanged(this.address)
        },

        updateWallet() {
            const wallets = this.profile.wallets
            this.wallet = wallets.find(wallet => wallet.address === this.address)

            if (!this.wallet) {
                if (wallets.length > 0) {
                    this.wallet = wallets[0]
                } else {
                    this.debugMessage = "Didn't find any wallet"
                    walletApi.alert.error(this.debugMessage)
                }
            }
        },

        updateCurrentRewardSum() {
            let sum = 0.0
            this.repository.stackingRewardsMap.get(this.year).forEach(transaction => {
                const tokens = transaction.amount / utils.tokenValueFactor
                sum = sum + tokens * transaction.closePrice
            })
            this.rewardSum = sum
        },

        async onExport() {
            const rows = []
            const header = `${this.profile.network.token} Amount | ${this.profile.currency} Value | Date | Transaction ID`
            rows.push(header)

            this.repository.stackingRewardsMap.get(this.year).forEach(transaction => {
                rows.push(utils.buildExportRow(this.profile, transaction))
            })

            try {
                const asString = rows.join("\n")
                const fileName = `stacking_reward_report_${this.address}_${this.year}.csv`
                const filePath = await walletApi.dialogs.save(asString, fileName, 'csv')

                if (filePath) {
                    walletApi.alert.success(`Your report was saved at: ${filePath}`)
                }
            } catch (error) {
                walletApi.alert.error(error)
            }
        },
    }
}