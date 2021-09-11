// Most of this is a copy of https://github.com/dated/delegate-calculator-plugin/blob/master/src/components/modals/DisclaimerModal.js
const Keys = require('../Keys')
const Strings = require('../Strings')

module.exports = {
    template: `
    <ModalConfirmation
      container-classes="max-w-md"
      v-bind:title="title"
      v-bind:note="message"
      v-bind:cancel-button="cancel"
      v-bind:continue-button="accept"
      @cancel="emitCancel"
      @close="emitCancel"
      @continue="emitConfirm"
    />
  `,

    props: {
        callback: {
            type: Function,
            required: true
        }
    },

    methods: {

        emitCancel() {
            this.callback(Keys.CANCEL)
        },

        emitConfirm() {
            this.callback(Keys.CONFIRM)
        }
    },

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },

        title() {
            return Strings.getString(this.profile, Strings.DISCLAIMER_TITLE)
        },

        message() {
            return Strings.getString(this.profile, Strings.DISCLAIMER_NOTE)
        },

        cancel() {
            return Strings.getString(this.profile, Strings.CANCEL)
        },

        accept() {
            return Strings.getString(this.profile, Strings.ACCEPT)
        },
    },
}
