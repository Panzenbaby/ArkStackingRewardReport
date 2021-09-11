const Strings = require("../Strings");

module.exports = {
    template: `
    <Ark>
        <template slot="footer">
            <span class="text-theme-footer-text">
                {{ message }} <span class="font-semibold">Panzenbaby</span>
            </span>
        </template>
    </Ark>
  `,

    computed: {
        profile() {
            return walletApi.profiles.getCurrent()
        },

        message() {
            return Strings.getString(this.profile, Strings.FOOTER)
        },
    }
}
