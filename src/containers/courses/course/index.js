import React from "react";
import PropTypes from "prop-types";

// material-ui
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "1rem",
  },
  title: {
    fontSize: "1.2rem",
  },
});

/**
 * This is Course component, for course card display
 */
export default function Course({ id, name, handleSelectCourse }) {
  const classes = useStyles();
  return (
    <Card onClick={() => handleSelectCourse(id)} className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
}

Course.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleSelectCourse: PropTypes.func.isRequired,
};
