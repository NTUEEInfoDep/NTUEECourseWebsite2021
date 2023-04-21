import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import MDEditor from "@uiw/react-md-editor";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "10px",
    textAlign: "center",
  },
  avatar: {
    margin: "0 15px",
    color: "white",
    width: theme.spacing(4),
    height: theme.spacing(4),
    // width:'10%',
  },
  gridStyle: {
    marginTop:"6%",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    // padding: "5px 0px"
  },
  subtitle: {
    // color: "white",
    margin: "auto 0",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  paragraph: {
    width: "100%",
    color: "white",
    textAlign: "start",
    fontSize: "16px",
    padding: "10px",
    opacity: ".8",
    lineHeight: "1.8",
    textIndent: "32px",
    letterSpacing: "1px",
  },
}));

export default function Card(props) {
  const classes = useStyles();
  const { title, icon, description } = props;

  return (
    <Grid container style={{ padding: "10px" }}>
      <Grid item className={classes.gridStyle} xs={12}>
        <Avatar component={icon} className={classes.avatar} />
        <Typography className={classes.subtitle}>{title}</Typography>
      </Grid>
      <Grid item>
	<div
          style={{
    	    width: "100%",
            color: "white",
    	    textAlign: "start",
      	    fontSize: "16px",
    	    padding: "10px",
    	    opacity: ".8",
    	    lineHeight: "1.8",
    	    textIndent: "32px",
    	    letterSpacing: "1px",
          }}
        >
          <MDEditor.Markdown source={description} style={{ color: "inherit", backgroundColor: "inherit" }} />
        </div>
      </Grid>
    </Grid>
  );
}
