import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3f51b5",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff9800",
      light: "ffac33",
      contrastText: "#fff",
    },
  },
});

export default theme;
