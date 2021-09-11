const Strings = require('../Strings')

module.exports = {

    template: `
    <ModalWindow
      container-classes="max-w-md"
      title="Info"
      @close="emitClose"
    >
      <div class="mb-6 text-grey-darker text-lg">
        <p>
            {{ priceInfoOne }} <span class=\"text-blue-light\">https://min-api.cryptocompare.com</span> {{ priceInfoTwo }}
        </p>

        <p class="mt-10">
            {{ thankInfoOne }} <a target="_blank" :href="[profile.network.explorer, 'wallets', 'dated'].join('/')" > <span class="font-semibold">dated</span> </a> {{ thankInfoTwo }}
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

        priceInfoOne() {
            return Strings.getString(this.profile, Strings.INFO_MODAL_PRICES_ONE)
        },

        priceInfoTwo() {
            return Strings.getString(this.profile, Strings.INFO_MODAL_PRICES_TWO)
        },

        thankInfoOne() {
            return Strings.getString(this.profile, Strings.INFO_MODAL_THANKS_ONE)
        },

        thankInfoTwo() {
            return Strings.getString(this.profile, Strings.INFO_MODAL_THANKS_TWO)
        },
    }
}