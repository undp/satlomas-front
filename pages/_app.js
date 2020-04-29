import React from "react";
import App, { Container } from "next/app";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import withGA from "../utils/ga";
import { appWithTranslation, Router } from "../i18n";
import i18next from "i18next";
import NProgress from "next-nprogress/component";
import { SnackbarProvider } from "notistack";

class CustomApp extends App {
  componentDidMount() {
    const {
      query: { lang },
    } = this.props.router;

    // Change language if query string contains "lang" parameter
    if (lang) {
      console.log(`Setting language to '${lang}'`);
      i18next.changeLanguage(lang);
    }
  }

  render() {
    const { Component, pageProps, analytics } = this.props;

    React.useEffect(() => {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles) {
        jssStyles.parentElement.removeChild(jssStyles);
      }
    }, []);

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* Progress indicator for page transitioning */}
          <NProgress />
          <SnackbarProvider maxSnack={3}>
            <Component
              {...pageProps}
              analytics={analytics}
            />
          </SnackbarProvider>
        </ThemeProvider>
      </Container>
    );
  }
}

CustomApp = appWithTranslation(CustomApp);
CustomApp = withGA("UA-105156301-5", Router)(CustomApp);

export default CustomApp;
