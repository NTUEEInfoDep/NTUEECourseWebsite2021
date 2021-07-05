import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#1976d2",
      main: "#1976d2",
      dark: "#1976d2",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(240,240,240,0.7)",
      main: "rgba(240,240,240,0.7)",
      dark: "rgba(240,240,240,0.7)",
      contrastText: "#fff",
    },
  },
});

export default theme;
