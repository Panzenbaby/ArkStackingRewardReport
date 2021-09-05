const Header = require('../components/Header')

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
              <b>Foooooooo</b>
            </div>
          </div>
        </div>
      </div>
      </div>
    `,

    components: {
        Header
    },

    async mounted () {
        this.address = walletApi.storage.get('address')
        this.updateWallet()
    },

    computed: {
        profile () {
            return walletApi.profiles.getCurrent()
        },

        wallets () {
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
        }
    }),

    methods: {

        openWalletImport () {
            walletApi.route.goTo('wallet-import')
        },

        async handleHeaderEvent({component, event, options }) {
            if (event === 'addressChange') {
                this.address = options.address
                walletApi.storage.set('address', this.address)

                this.updateWallet()
            }
        },

        updateWallet() {
            this.wallet = this.wallets.find(wallet => wallet.address === this.address)

            if (!this.wallet) {
                try {
                    this.wallet = this.wallets[0]
                } catch (error) {
                    // TODO handle error?
                }
            }
        }
    }
}