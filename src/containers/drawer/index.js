import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { Link, useHistory } from "react-router-dom";
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
  ListItemIcon,
} from "@material-ui/core/";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import HomeIcon from "@material-ui/icons/Home"; // Main
import ExitToAppIcon from "@material-ui/icons/ExitToApp"; // Login, Logout
import ClassIcon from "@material-ui/icons/Class"; // Courses
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck"; //  Result
import Search from "@material-ui/icons/Search";
import PeopleIcon from "@material-ui/icons/People"; // Student Data
import CloudUploadIcon from "@material-ui/icons/CloudUpload"; // Course Manage
import ShuffleIcon from "@material-ui/icons/Shuffle"; // Distribute
// slices, logout
import { Redirect } from "react-router";
import { selectSession, logout } from "../../slices/sessionSlice";
// route

const drawerWidth = 200;
const maxPhoneWidth = 700;

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
    paddingTop: theme.spacing(1),
    color: "#fff",
    boxShadow: "none",
    backgroundColor: "rgb(25,34,49,.7)",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up("phone")]: {
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
    [theme.breakpoints.up("phone")]: {
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
    [theme.breakpoints.up("phone")]: {
      width: theme.spacing(0) + 1,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  menuButton: {
    marginRight: 10,
  },
  iconButton: {
    marginRight: 0,
  },
  toolbar: {
    marginTop: theme.spacing(1),
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
    [theme.breakpoints.up("phone")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    marginLeft: 0,
  },
  contentShift: {
    [theme.breakpoints.up("phone")]: {
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
  const history = useHistory();
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
        { text: "Login", to: "/login", icon: <ExitToAppIcon /> },
      ]
    : {
        1: [
          { text: "Main", to: "/", icon: <HomeIcon /> },
          { text: "Courses", to: "/courses", icon: <ClassIcon /> },
          { text: "Result", to: "/result", icon: <PlaylistAddCheckIcon /> },
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
          { text: "Sample", to: "/sample", icon: <Search /> },
        ],
        2: [
          { text: "Main", to: "/", icon: <HomeIcon /> },
          { text: "Courses", to: "/courses", icon: <ClassIcon /> },
          { text: "Result", to: "/result", icon: <PlaylistAddCheckIcon /> },
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
          {
            text: "Distribute",
            to: "/distribute",
            icon: <ShuffleIcon />,
          },
          { text: "Sample", to: "/sample", icon: <Search /> },
        ],
      }[authority] || [
        { text: "Main", to: "/", icon: <HomeIcon /> },
        { text: "Courses", to: "/courses", icon: <ClassIcon /> },
        { text: "Result", to: "/result", icon: <PlaylistAddCheckIcon /> },
      ];

  const userName = isLogin ? userID : "";

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
              [classes.hide]: !open || window.innerWidth >= maxPhoneWidth,
            })}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
          <Typography variant="h5" className={classes.appBarTypography}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/")}
              aria-hidden="true"
            >
              NTUEE
            </div>
          </Typography>
          {/* <Typography
            variant="h6"
            className={clsx({
              [classes.hide]: isLogin,
            })}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/login")}
              aria-hidden="true"
            >
              LOGIN
            </div>
          </Typography> */}
          <Typography variant="h6">{userName}</Typography>
          <IconButton
            className={clsx(classes.iconButton, {
              [classes.hide]: !isLogin,
            })}
            onClick={() => dispatch(logout())}
          >
            <ExitToAppIcon />
          </IconButton>
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
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Drawer;
