import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#1a237e",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffb74d",
      light: "ffac33",
      contrastText: "#fff",
    },
  },
});

export default theme;
