const Header = require('../components/Header')
const Footer = require('../components/Footer')
const TransactionTable = require('../components/TransactionTable')
const Repository = require('../Repository')

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
                :transactions="repository.stackingRewards"
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

    async mounted() {
        this.repository = new Repository()

        this.isLoading = true
        this.address = walletApi.storage.get('address')

        this.updateWallet()
        await this.repository.changeAddress(this.address)

        this.isLoading = false
    },

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },

        wallets() {
            return this.profile.wallets
        },

        hasWallets() {
            return !!(this.wallets && this.wallets.length)
        },
    },

    data: () => ({
        address: '',
        isLoading: false,
        wallet: {
            address: '',
            balance: '',
            vote: ''
        },
        debugMessage: '',
        transactions: [{
            year: 0,
            transactions: [{
                type: 0
            }]
        }]
    }),

    methods: {

        openWalletImport() {
            walletApi.route.goTo('wallet-import')
        },

        async handleHeaderEvent({component, event, options}) {
            if (event === 'addressChange') {
                this.address = options.address
                walletApi.storage.set('address', this.address)

                this.updateWallet()
                if (this.wallet) {
                    this.isLoading = true
                    this.debugMessage = await this.repository.changeAddress(this.address)
                    this.isLoading = false
                }
            }
        },

        updateWallet() {
            this.wallet = this.wallets.find(wallet => wallet.address === this.address)

            if (!this.wallet) {
                if (this.wallets.length > 0) {
                    this.wallet = this.wallets[0]
                } else {
                    this.debugMessage = "Didn't find any wallet"
                    walletApi.alert.error(this.debugMessage)
                }
            }
        },
    }
}