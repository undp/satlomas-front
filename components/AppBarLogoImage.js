import React from "react";
import { Link } from "../i18n";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  img: {
    height: 16,
    cursor: "pointer",
  },
});

const AppBarLogoImage = ({ classes }) => (
  <Link href="/">
    <img className={classes.img} src="/static/app-logo.png" />
  </Link>
);

export default withStyles(styles)(AppBarLogoImage);
