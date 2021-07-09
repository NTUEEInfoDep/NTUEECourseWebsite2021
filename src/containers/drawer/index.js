import React, { useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// material_ui
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer as MUIDrawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core/";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
// slices
import { selectSession } from "../../slices/sessionSlice";

const drawerWidth = 150;

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
  drawerOpen: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  menuButton: {
    marginRight: 36,
  },
  drawerClose: {
    overflowX: "hidden",
    width: theme.spacing(0),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(0) + 1,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
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

//

const Drawer = ({ children }) => {
  const { isLogin, authority } = useSelector(selectSession);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const itemList = !isLogin
    ? [
        { text: "Main", to: "/" },
        { text: "Courses", to: "/courses" },
        { text: "Login", to: "/login" },
      ]
    : authority == "Admin" || authority == "Maintainer"
    ? [
        { text: "Main", to: "/" },
        { text: "Courses", to: "/courses" },
        {
          text: "Student Data",
          to: "/studentdata",
        },
        {
          text: "Course Manage",
          to: "/course-manage",
        },
      ]
    : [
        { text: "Main", to: "/" },
        { text: "Courses", to: "/courses" },
      ];

  return (
    <div className={classes.root}>
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
              [classes.hide]: !open || window.innerWidth >= 600,
            })}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            NTUEE course pre-selection
          </Typography>
        </Toolbar>
      </AppBar>

      <MUIDrawer
        anchor={window.innerWidth >= 600 ? "left" : "top"}
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
          {itemList.map(({ text, to }) => {
            return (
              <ListItem button key={text} component={Link} to={to}>
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
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Drawer;
