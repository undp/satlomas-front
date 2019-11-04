import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import BasicAppbar from "../../../components/BasicAppbar";
import ContactFormModalContent from "../../../components/home/ContactFormModalContent";
import { withNamespaces } from "../../../i18n";
import { withAuthSync } from "../../../utils/auth";
import { routerPush } from "../../../utils/router";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(800 + theme.spacing.unit * 2 * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  header: {
    marginBottom: theme.spacing.unit * 3,
    textAlign: "center"
  },
  card: {
    display: "flex", // Fix IE 11 issue.
    flexDirection: "column",
    height: "100%",
    [theme.breakpoints.up(220 + theme.spacing.unit * 2 * 2)]: {
      width: 220,
      height: 220,
      marginLeft: 18,
      marginTop: 15
    }
  },
  cardcontent: {
    display: "flex",
    flex: "1 0 auto",
    alignItems: "flex-start",
    flexDirection: "column",
    height: "75%"
  },
  cardactions: {
    display: "flex",
    justifyContent: "flex-start"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justify: "evenly",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  }
});

class NewODModel extends React.Component {
  static async getInitialProps() {
    return {
      namespacesRequired: ["models"]
    };
  }

  state = {
    contactModalOpen: false
  };

  handleClick = type => {
    routerPush(`/models/new/${type}`);
  };

  handleClickOpen = () => {
    this.setState({ contactModalOpen: true });
  };

  handleContactModalClose = () => {
    this.setState({ contactModalOpen: false });
  };

  render() {
    const { t, token, classes } = this.props;
    const { contactModalOpen } = this.state;

    return (
      <React.Fragment>
        <Head>
          <title>{t("new_title")}</title>
        </Head>
        <BasicAppbar />
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <Typography className={classes.header} component="h1" variant="h5">
              {t("new.header")}
            </Typography>
            <Typography variant="subtitle1">{t("new.explanation")}</Typography>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardcontent}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {t("object_btn")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t("object_desc")}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardactions}>
                    <Button
                      color="primary"
                      onClick={() => this.handleClick("od")}
                    >
                      {t("new_btn")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardcontent}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {t("change_detection_btn")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t("change_detection_desc")}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardactions}>
                    <Button color="primary" onClick={this.handleClickOpen}>
                      {t("new_btn")}
                    </Button>
                    <ContactFormModalContent
                      open={contactModalOpen}
                      onClose={this.handleContactModalClose}
                      token={token}
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardcontent}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {t("classification_btn")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t("classification_desc")}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardactions}>
                    <Button color="primary" onClick={this.handleClickOpen}>
                      {t("new_btn")}
                    </Button>
                    <ContactFormModalContent
                      open={contactModalOpen}
                      onClose={this.handleContactModalClose}
                      token={token}
                    />
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

NewODModel.propTypes = {
  classes: PropTypes.object.isRequired
};

NewODModel = withStyles(styles)(NewODModel);
NewODModel = withNamespaces("models")(NewODModel);
NewODModel = withAuthSync(NewODModel);

export default NewODModel;
