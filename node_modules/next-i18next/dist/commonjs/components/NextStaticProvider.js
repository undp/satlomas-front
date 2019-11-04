"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactI18next = require("react-i18next");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NextStaticProvider extends _react.default.Component {
  render() {
    const {
      children,
      tReady
    } = this.props;
    return tReady ? children : null;
  }

}

NextStaticProvider.propTypes = {
  children: _propTypes.default.node.isRequired,
  tReady: _propTypes.default.bool.isRequired
};

var _default = (0, _reactI18next.withNamespaces)()(NextStaticProvider);

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;