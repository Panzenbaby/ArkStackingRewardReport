
module.exports = {

    template: `
    <ModalWindow
      container-classes="max-w-md"
      title="Info"
      @close="emitClose"
    >
      <div class="mb-6 text-grey-darker text-lg">
        <p class="mb-3">
            This plugin uses the public REST Api from <span class="text-blue-light">https://min-api.cryptocompare.com</span> to get the price of each transaction. The displayed price is the close price of the day the transaction has been proceeded.
        </p>
        
        <p>
            TODO: Use of own risk … no guaranty … 
        </p>

        <p>
          Special thanks to the delegate <a target="_blank" :href="[profile.network.explorer, 'wallets', 'dated'].join('/')" > <span class="font-semibold">dated</span> </a> for building and maintaining the plugins <span class="font-semibold">Transaction Export</span> and <span class="font-semibold">ARK Delegate Calculator</span> which has been a huge motivation and helped me a lot to understand how to write a plugin.
        </p>
      </div>
    </ModalConfirmation>
    `,

    props: {
        callback: {
            type: Function,
            required: true
        }
    },

    methods: {

        emitClose() {
            this.callback()
        }
    },

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },
    }
}