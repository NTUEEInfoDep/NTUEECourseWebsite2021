// import { Container } from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  styledCourse: {
    backgroundColor: "#eee",
    borderRadius: 4,
    padding: "4px 8px",
    transition: "background-color .8s ease-out",
    marginTop: 8,
    color: "#071214",

    ":hover": {
      backgroundColor: "#fff",
      transition: "background-color .1s ease-in",
    },
  },
});
const Course = ({ courseId, course, index }) => {
  const classes = useStyles();
  return (
    <Draggable draggableId={courseId} index={index}>
      {(provided) => (
        <div
          className={classes.styledCourse}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {index + 1}
          {course}
        </div>
      )}
    </Draggable>
  );
};

Course.propTypes = {
  courseId: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  // course: PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  //   content: PropTypes.string.isRequired,
  // }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Course;
