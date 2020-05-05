import { createMuiTheme } from '@material-ui/core/styles';
import { red, teal, pink } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: pink,
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;