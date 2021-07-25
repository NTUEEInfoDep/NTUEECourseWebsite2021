import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// material_ui
import {
  makeStyles,
  useTheme,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer as MUIDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core/";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import HomeIcon from "@material-ui/icons/Home"; //Main
import ExitToAppIcon from "@material-ui/icons/ExitToApp"; //Login
import ClassIcon from "@material-ui/icons/Class"; //Courses
import PeopleIcon from "@material-ui/icons/People"; //Student Data
import CloudUploadIcon from "@material-ui/icons/CloudUpload"; //Course Manage
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab"; //Logout
// slices
import { selectSession } from "../../slices/sessionSlice";
//logout
import { logout } from "../../slices/sessionSlice";

const drawerWidth = 200;
const maxPhoneWidth = 700;

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  root: {
    //  display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  hide: {
    display: "none",
  },
  appBarTypography: {
    flexGrow: 1,
  },
  drawerOpen: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  drawerClose: {
    overflowX: "hidden",
    overflowY: "hidden",
    width: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(0) + 1,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  menuButton: {
    marginRight: 36,
  },
  iconButton: {
    marginRight: 0,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    marginLeft: 0,
  },
  contentShift: {
    [theme.breakpoints.up("sm")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    },
  },
  offset: theme.mixins.toolbar,
}));

const Drawer = ({ children }) => {
  const { isLogin, authority, userID } = useSelector(selectSession);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const itemList = !isLogin
    ? [
        { text: "Main", to: "/", icon: <HomeIcon /> },
        { text: "Courses", to: "/courses", icon: <ClassIcon /> },
        { text: "Login", to: "/login", icon: <ExitToAppIcon /> },
      ]
    : authority === 1 || authority === 2
    ? [
        { text: "Main", to: "/", icon: <HomeIcon /> },
        { text: "Courses", to: "/courses", icon: <ClassIcon /> },
        {
          text: "Student Data",
          to: "/studentdata",
          icon: <PeopleIcon />,
        },
        {
          text: "Course Manage",
          to: "/course-manage",
          icon: <CloudUploadIcon />,
        },
      ]
    : [
        { text: "Main", to: "/", icon: <HomeIcon /> },
        { text: "Courses", to: "/courses", icon: <ClassIcon /> },
      ];

  const userName = isLogin ? userID : "";

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
          position="fixed"
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="close drawer"
              onClick={handleDrawerClose}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: !open || window.innerWidth >= maxPhoneWidth,
              })}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
            <Typography variant="h6" className={classes.appBarTypography}>
              NTUEE
            </Typography>
            <IconButton
              className={[
                clsx(classes.iconButton, {
                  [classes.hide]: !isLogin,
                }),
              ]}
              onClick={() => dispatch(logout())}
            >
              <KeyboardTabIcon />
            </IconButton>
            <Typography variant="h6">{userName}</Typography>
          </Toolbar>
        </AppBar>

        <MUIDrawer
          anchor={window.innerWidth >= maxPhoneWidth ? "left" : "top"}
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>

          <List>
            {itemList.map(({ text, to, icon }) => {
              return (
                <ListItem
                  button
                  key={text}
                  component={Link}
                  to={to}
                  onClick={handleDrawerClose}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              );
            })}
          </List>
        </MUIDrawer>
        <div className={classes.offset} />
        <div
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          {children}
        </div>
      </ThemeProvider>
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Drawer;
