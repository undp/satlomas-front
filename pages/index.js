import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation, i18n } from "../i18n";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import AppbarButtons from "../components/AppbarButtons";
import config from "../config";

const { appName } = config;

import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  grow: {
    flexGrow: 1,
  },
  rightButtons: {
    position: "relative",
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  menuItem: {
    minWidth: 150,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  cardGrid: {
    padding: `${theme.spacing(8)}px 0`,
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
    cursor: "pointer",
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  toolbarButtons: {
    marginLeft: 'auto',
  },
});

const cards = [
  {
    key: "green-map",
    title: "Cobertura verde en Lomas",
    description:
      "Mapa de cobertura verde de Lomas, basado en el producto VI de MODIS, actualizado mensualmente.",
    image: "",
    buttons: [{ name: "Ver", href: "/maps/vi-lomas-changes" }],
  },
  {
    key: "changes-map",
    title: "Cobertura de Lomas",
    description:
      "Mapa de cambios de cobertura de loma perdida y remanente, basado en las imágenes de los satélites Sentinel-1 y Sentinel-2, actualizado mensualmente.",
    image: "",
    buttons: [{ name: "Ver", href: "/maps/lomas-changes" }],
  },
  {
    key: "stations-map",
    title: "Mapa de Estaciones",
    description:
      "Mapa con las estaciones meteorológicas instaladas actualmente",
    image: "/static/thumbs/stations-map.jpg",
    buttons: [{ name: "Ver", href: "/stations/map" }],
  },
  {
    key: "station-dashboard",
    title: "Dashboard de Estaciones",
    description:
      "Dashboard de las estaciones meteorológicas, con información actualizada en tiempo real.",
    image: "/static/thumbs/stations-dashboard.jpg",
    buttons: [{ name: "Dashboard", href: "/stations/dashboard" }, { name: "Tabla", href: "/stations/data" }],
  },
];

class Index extends React.Component {
  state = {
    section: null,
    beta: false,
    contextualMenuOpen: null,
    username: ""
  }

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["me", "common"],
      query: query,
    };
  }

  constructor(props) {
    super(props);

    let { section } = props.query;

    // Set current section based on path
    if (section && sortedSections.includes(section)) {
      this.state.section = section;
    }
  }

  render() {
    const { classes, t } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>{appName}</title>
        </Head>
        <CssBaseline />
        <AppBar
          position="static"
          className={classes.appBar}
        >
          <Toolbar>
            {/* <CameraIcon className={classes.icon} /> */}
            <Typography variant="h6" color="inherit" noWrap>
              {appName}
            </Typography>
            <div className={classes.grow} />
            <div className={classes.rightButtons}>
              <AppbarButtons />
            </div>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                {appName}
              </Typography>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph
              >
                Something short and leading about the collection below—its contents,
                the creator, etc. Make it short and sweet, but not too short so
                folks don&apos;t simply skip over it entirely.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Más información
                    </Button>
                  </Grid>
                  {/* <Grid item>
                      <Button variant="outlined" color="primary">
                        Secondary action
                      </Button>
                    </Grid> */}
                </Grid>
              </div>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={5}>
              {cards.map((card) => (
                <Grid item key={card.key} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <Link href={card.buttons[0].href}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={card.image}
                        title="Screenshot"
                      >
                        &nbsp;
                      </CardMedia>
                    </Link>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.title}
                      </Typography>
                      <Typography>{card.description}</Typography>
                    </CardContent>
                    <CardActions>
                      {card.buttons.map(button => (<Button
                        key={button.name}
                        size="small"
                        color="primary"
                        onClick={() => Router.push(button.href)}
                      >
                        {button.name}
                      </Button>))}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}


Index.propTypes = {
  classes: PropTypes.object.isRequired,
};
Index = withTranslation(["me", "common"])(Index);
Index = withStyles(styles)(Index);

export default Index;
