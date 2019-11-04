"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _detectNode = _interopRequireDefault(require("detect-node"));

var _i18next = _interopRequireDefault(require("i18next"));

var _i18nextXhrBackend = _interopRequireDefault(require("i18next-xhr-backend"));

var _i18nextBrowserLanguagedetector = _interopRequireDefault(require("i18next-browser-languagedetector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const i18n = _i18next.default.default ? _i18next.default.default : _i18next.default;
i18n.nsFromReactTree = [];

var _default = config => {
  if (!i18n.isInitialized) {
    if (_detectNode.default) {
      const i18nextNodeBackend = eval("require('i18next-node-fs-backend')");
      const i18nextMiddleware = eval("require('i18next-express-middleware')");
      i18n.use(i18nextNodeBackend);

      if (config.serverLanguageDetection) {
        const serverDetectors = new i18nextMiddleware.LanguageDetector();
        config.customDetectors.forEach(detector => serverDetectors.addDetector(detector));
        i18n.use(serverDetectors);
      }
    } else {
      i18n.use(_i18nextXhrBackend.default);

      if (config.browserLanguageDetection) {
        const browserDetectors = new _i18nextBrowserLanguagedetector.default();
        config.customDetectors.forEach(detector => browserDetectors.addDetector(detector));
        i18n.use(browserDetectors);
      }
    }

    config.use.forEach(x => i18n.use(x));
    i18n.init(config);
  }

  return i18n;
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;