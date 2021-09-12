const NO_WALLET_MESSAGE = "NO_WALLET_MESSAGE"
const WALLET_IMPORT_NOW = "WALLET_IMPORT_NOW"
const ADDRESS = "ADDRESS"
const PERIOD = "PERIOD"
const RECEIVED_STACKING_REWARDS = "RECEIVED_STACKING_REWARDS"

const EXPORT_SUCCESS = "EXPORT_SUCCESS"

const TOOLTIP_EXPORT = "TOOLTIP_EXPORT"
const TOOLTIP_RELOAD = "TOOLTIP_RELOAD"

const DISCLAIMER_TITLE = "DISCLAIMER_TITLE"
const DISCLAIMER_NOTE = "DISCLAIMER_NOTE"

const INFO = "INFO"
const INFO_MODAL_PRICES_ONE = "INFO_MODAL_PRICES_ONE"
const INFO_MODAL_PRICES_TWO = "INFO_MODAL_PRICES_TWO"
const INFO_MODAL_THANKS_ONE = "INFO_MODAL_THANKS_ONE"
const INFO_MODAL_THANKS_TWO = "INFO_MODAL_THANKS_TWO"

const TABLE_HEADER_AMOUNT = "TABLE_HEADER_AMOUNT"
const TABLE_HEADER_VALUE = "TABLE_HEADER_VALUE"
const TABLE_HEADER_DATE = "TABLE_HEADER_DATE"
const TABLE_HEADER_FROM = "TABLE_HEADER_FROM"
const TABLE_HEADER_TRANSACTION = "TABLE_HEADER_TRANSACTION"

const SHOW_IN_EXPLORER = "SHOW_IN_EXPLORER"

const FOOTER = "FOOTER"
const CANCEL = "CANCEL"
const ACCEPT = "ACCEPT"
const RETRY = "RETRY"
const ERROR_TITLE = "ERROR_TITLE"

const en = {
    NO_WALLET_MESSAGE: "Your profile has no wallets yet.",
    WALLET_IMPORT_NOW: "Import a wallet now!",
    ADDRESS: "Address",
    PERIOD: "Period",
    RECEIVED_STACKING_REWARDS: "Received Stacking Rewards",
    EXPORT_SUCCESS: "Your report was saved at: ",
    TOOLTIP_EXPORT: "Export",
    TOOLTIP_RELOAD: "Reload",
    DISCLAIMER_TITLE: "Disclaimer",
    DISCLAIMER_NOTE: "The information presented by this plugin has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for tax, legal or accounting advice.",
    INFO: "Info",
    INFO_MODAL_PRICES_ONE: "This plugin uses the public REST Api from",
    INFO_MODAL_PRICES_TWO: "to get the price of each transaction. The displayed price is the close price of the day the transaction has been proceeded.",
    INFO_MODAL_THANKS_ONE: "Special thanks to the delegate ",
    INFO_MODAL_THANKS_TWO: "for building and maintaining the plugins Transaction Export and ARK Delegate Calculator which has been a huge motivation and helped me a lot to understand how to write a plugin.",
    TABLE_HEADER_AMOUNT: "Amount",
    TABLE_HEADER_VALUE: "Value",
    TABLE_HEADER_DATE: "Date",
    TABLE_HEADER_FROM: "From",
    TABLE_HEADER_TRANSACTION: "Transaction ID",
    SHOW_IN_EXPLORER: "Show in Explorer",
    FOOTER: "Made with ♥ by ",
    CANCEL: "Cancel",
    ACCEPT: "Accept",
    RETRY: "Retry",
    ERROR_TITLE: "An error occurred",
}

const de = {
    NO_WALLET_MESSAGE: "In deinem Profil ist noch keine Wallet hinterlegt.",
    WALLET_IMPORT_NOW: "Importiere jetzt eine Wallet!",
    ADDRESS: "Adresse",
    PERIOD: "Zeitraum",
    RECEIVED_STACKING_REWARDS: "Erhaltene Stacking Rewards",
    TOOLTIP_EXPORT: "Exportieren",
    TOOLTIP_RELOAD: "Neu laden",
    EXPORT_SUCCESS: "Dein Bericht wurde hier gespeichert: ",
    DISCLAIMER_TITLE: "Haftungsausschluss",
    DISCLAIMER_NOTE: "Die von diesem Plugin präsentierten Informationen wurden nur zu Informationszwecken erstellt und dienen nicht der Bereitstellung von Steuer-, Rechts- oder Buchhaltungsberatung und sollten daher nicht als Grundlage dienen.",
    INFO: "Info",
    INFO_MODAL_PRICES_ONE: "Dieses Plugin nutzt die REST API von",
    INFO_MODAL_PRICES_TWO: "um den Preis einer jeden Transaktion zu laden. Bei den angezeigten Preisen handelt es sich um den Schlusskurs des Tages an dem die Transaktion durchgeführt wurde.",
    INFO_MODAL_THANKS_ONE: "Ein großer Dank geht dan den Delegate",
    INFO_MODAL_THANKS_TWO: "für das Erstellen und Pflegen der Plugins Transaction Export und ARK Delegate Calculator, die mir als Motivation dienten und mir dabei halfen zu verstehen, wie man ein Plugin für die Ark Desktop Wallet zu schreiben hat.",
    TABLE_HEADER_AMOUNT: "Anzahl",
    TABLE_HEADER_VALUE: "Wert",
    TABLE_HEADER_DATE: "Datum",
    TABLE_HEADER_FROM: "Von",
    TABLE_HEADER_TRANSACTION: "Transaktions ID",
    SHOW_IN_EXPLORER: "Im Explorer öffnen",
    FOOTER: "Gemacht mit ♥ von",
    CANCEL: "Abbrechen",
    ACCEPT: "Akzeptieren",
    RETRY: "Erneut versuchen",
    ERROR_TITLE: "Es ist ein Fehler aufgetreten",
}

module.exports = {

    getString(profile, key) {
        let strings
        switch (profile.language) {
            case "de-DE":
                strings = de
                break;
            default:
                strings = en
                break;
        }

        let string = strings[key]
        if (string) {
            return string
        }

        return en[key]
    },

    NO_WALLET_MESSAGE: NO_WALLET_MESSAGE,
    WALLET_IMPORT_NOW: WALLET_IMPORT_NOW,
    ADDRESS: ADDRESS,
    PERIOD: PERIOD,
    RECEIVED_STACKING_REWARDS: RECEIVED_STACKING_REWARDS,
    EXPORT_SUCCESS: EXPORT_SUCCESS,
    TOOLTIP_EXPORT: TOOLTIP_EXPORT,
    TOOLTIP_RELOAD: TOOLTIP_RELOAD,
    DISCLAIMER_TITLE: DISCLAIMER_TITLE,
    DISCLAIMER_NOTE: DISCLAIMER_NOTE,
    INFO: INFO,
    INFO_MODAL_PRICES_ONE: INFO_MODAL_PRICES_ONE,
    INFO_MODAL_PRICES_TWO: INFO_MODAL_PRICES_TWO,
    INFO_MODAL_THANKS_ONE: INFO_MODAL_THANKS_ONE,
    INFO_MODAL_THANKS_TWO: INFO_MODAL_THANKS_TWO,
    TABLE_HEADER_AMOUNT: TABLE_HEADER_AMOUNT,
    TABLE_HEADER_VALUE: TABLE_HEADER_VALUE,
    TABLE_HEADER_DATE: TABLE_HEADER_DATE,
    TABLE_HEADER_FROM: TABLE_HEADER_FROM,
    TABLE_HEADER_TRANSACTION: TABLE_HEADER_TRANSACTION,
    SHOW_IN_EXPLORER: SHOW_IN_EXPLORER,
    FOOTER: FOOTER,
    CANCEL: CANCEL,
    ACCEPT: ACCEPT,
    RETRY: RETRY,
    ERROR_TITLE: ERROR_TITLE,
}