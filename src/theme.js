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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      phone:700,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
