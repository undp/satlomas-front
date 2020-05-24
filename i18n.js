var NextI18Next = require("next-i18next").default;

module.exports = new NextI18Next({
  browserLanguageDetection: false,
  defaultLanguage: "es",
  otherLanguages: ["en"]
});
