function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { Trans } from 'react-i18next';
export default class WrappedTrans extends React.Component {
  render() {
    const {
      nextI18NextConfig
    } = this.props;
    const {
      i18n
    } = nextI18NextConfig;
    return React.createElement(Trans, _extends({}, this.props, {
      i18n: i18n
    }));
  }

}