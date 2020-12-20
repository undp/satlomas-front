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
  Paper,
  Typography,
} from "@material-ui/core";

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
    padding: `${theme.spacing(8)}px 0 0`,
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
  logo: {
    height: 100,
    display: "block",
    margin: "0 auto",
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
  cardTitle: {
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
  paperRoot: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    padding: theme.spacing(3),
    margin: `0 ${theme.spacing(3)}px ${theme.spacing(10)}px`,
  },
  paperParagraph: {
    margin: `${theme.spacing(2)}px 0`,
  },
});

const cards = [
  {
    key: "green-map",
    title: "Cobertura verde",
    description:
      "Mapa de cobertura de vegetación de Lomas, basado en el producto VI de MODIS, actualizado mensualmente.",
    image: "/static/thumbs/changes-map-vi-lomas.jpg",
    buttons: [{ name: "Ver", href: "/maps/vi-lomas-changes" }],
  },
  {
    key: "changes-map",
    title: "Cobertura de Loma perdida",
    description:
      "Mapa de cobertura de Loma perdida, basado en las imágenes de los satélites Sentinel-1 y Sentinel-2, actualizado mensualmente.",
    image: "/static/thumbs/changes-map-lomas.jpg",
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
    buttons: [
      { name: "Dashboard", href: "/stations/dashboard" },
      { name: "Tabla", href: "/stations/data" },
    ],
  },
];

class Index extends React.Component {
  state = {
    section: null,
    contextualMenuOpen: null,
    username: "",
  };

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
        <AppBar position="static" className={classes.appBar}>
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
              <img src="/static/logo.jpg" className={classes.logo} />
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                paragraph
              >
                Plataforma de monitoreo satelital
              </Typography>
              {/* <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Más información
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary">
                      Secondary action
                    </Button>
                  </Grid>
                </Grid>
              </div> */}
            </div>
          </div>

          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Paper
              classes={{
                root: classes.paperRoot,
              }}
              elevation={3}
            >
              <Typography variant="h6">¡Bienvenidos al SatLomas!</Typography>
              <Typography className={classes.paperParagraph}>
                La plataforma de monitoreo satelital "SatLomas" es una
                iniciativa del proyecto Conservación, gestión y rehabilitación
                de los ecosistemas frágiles de lomas (EbA Lomas) el cual es
                ejecutado por el Programa de las Naciones Unidas para el
                Desarrollo (PNUD) bajo la dirección del Servicio Nacional de
                Áreas Naturales Protegidas por el Estado (Sernanp) con el
                financiamiento del Fondo Mundial del Ambiente (GEF) y el soporte
                de la Agencia Espacial del Perú (Conida).
              </Typography>
              <Typography className={classes.paperParagraph}>
                La plataforma integra herramientas de código abierto para el
                procesamiento de imágenes satelitales públicas como el Sentinel
                -2 y PeruSat-1 con el objetivo de determinar las afectaciones
                por cambio de uso del suelo en los ecosistemas de lomas en Lima.
                Asimismo, monitorea la cobertura herbácea de los ecosistemas de
                lomas a través de las imágenes Modis.
              </Typography>
              <Typography className={classes.paperParagraph}>
                Además, cuenta con herramientas que tienen conexión a sensores
                IoT en tiempo real a fin medir y sistematizar la información de
                variables meteorológicas de las lomas de Lima
              </Typography>
            </Paper>

            {/* End hero unit */}
            <Grid container spacing={5}>
              {cards.map((card) => (
                <Grid item key={card.key} sm={6} md={6} lg={3}>
                  <Card className={classes.card}>
                    <Link href={card.buttons[0].href}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={card.image}
                        title={card.title}
                      >
                        &nbsp;
                      </CardMedia>
                    </Link>
                    <CardContent className={classes.cardContent}>
                      <Typography
                        className={classes.cardTitle}
                        gutterBottom
                        variant="h5"
                        component="h2"
                      >
                        {card.title}
                      </Typography>
                      <Typography>{card.description}</Typography>
                    </CardContent>
                    <CardActions>
                      {card.buttons.map((button) => (
                        <Button
                          key={button.name}
                          size="small"
                          color="primary"
                          onClick={() => Router.push(button.href)}
                        >
                          {button.name}
                        </Button>
                      ))}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
        {/* Footer */}
        {/* <footer className={classes.footer}>
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
        </footer> */}
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
