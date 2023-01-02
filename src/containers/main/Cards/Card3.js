import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: "10px",
    textAlign: "center",
  },
  avatar: {
    margin: "0 15px",
    marginTop: "5%",
    color: "white",
    width: theme.spacing(4),
    height: theme.spacing(4),
    // width:'10%',
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "6%",
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    marginBottom: "5%",
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
  text: {
    color: "white",
    fontSize: "16px",
    padding: "8px",
    opacity: ".8",
    lineHeight: "1.5",
    letterSpacing: "1px",
  },
}));

export default function Card3(props) {
  const classes = useStyles();
  const { message, title, icon, note, step, link } = props;
  return (
    <Grid container style={{ padding: "10px" }}>
      <Grid item className={classes.gridStyle}>
        <Avatar component={icon} className={classes.avatar} />
        <Grid
          item
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            className={classes.subtitle}
          >
            {step} {title}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
	{message.split('<br/>').map((paragraph)=> <Typography className={classes.paragraph}>
		{paragraph.split('**').map((msg, i)=>{
			return (i%2 === 1 ?   
				 <Box fontWeight='fontWeightBold' display='inline'>{msg}</Box>
				: msg)
		})} 
	</Typography>)}
        <Typography className={classes.paragraph}>{note}</Typography>
        {link ? (
          <Typography className={classes.text}>
            Google表單:{" "}
            <a href={link} style={{ overflow: "hidden", color: "#b2ebf2" }}>
              {link}
            </a>
          </Typography>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}
