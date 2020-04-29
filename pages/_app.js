import React from "react";
import PropTypes from 'prop-types';
import i18next from "i18next";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { appWithTranslation, Router } from "../i18n";
import withGA from "../utils/ga";
import theme from "../utils/theme";

function CustomApp(props) {
  const { Component, pageProps, analytics } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    const { query: { lang } } = this.props.router;

    // Change language if query string contains "lang" parameter
    if (lang) {
      console.log(`Setting language to '${lang}'`);
      i18next.changeLanguage(lang);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Component
          {...pageProps}
          analytics={analytics}
        />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

CustomApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

CustomApp = appWithTranslation(CustomApp);
CustomApp = withGA("UA-105156301-5", Router)(CustomApp);

export default CustomApp;
