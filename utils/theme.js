import { createMuiTheme } from "@material-ui/core/styles";
import { red, pink } from "@material-ui/core/colors";
import { esES } from "@material-ui/core/locale";

// Create a theme instance.
const theme = createMuiTheme(
  {
    palette: {
      primary: {
        main: "#189655",
      },
      secondary: pink,
      error: {
        main: red.A400,
      },
      background: {
        default: "#fff",
      },
    },
  },
  esES
);

export default theme;
