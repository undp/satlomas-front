"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactI18next = require("react-i18next");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class WrappedTrans extends _react.default.Component {
  render() {
    const {
      nextI18NextConfig
    } = this.props;
    const {
      i18n
    } = nextI18NextConfig;
    return _react.default.createElement(_reactI18next.Trans, _extends({}, this.props, {
      i18n: i18n
    }));
  }

}

exports.default = WrappedTrans;
module.exports = exports.default;
module.exports.default = exports.default;