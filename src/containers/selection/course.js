// import { Container } from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  styledCourse: {
    backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", // #eee
    opacity: 1.0,
    border: 0,
    borderRadius: 3, // 4
    padding: "15px 5px", // 4px, 8px
    //transition: "background-color .8s ease-out",
    marginTop: 8,
    color: "white", //#071214
    height: 45,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    //textAlign: "center",
    fontFamily: "Times, Times New Roman, serif",
    //opacity: 1.0,
    zIndex: 1,

    ":hover": {
      backgroundColor: "gold",
      transition: "background-color .1s ease-in",
    },
  },
});
const Course = (props) => {
  const { courseId, course, index } = props;
  const classes = useStyles();
  return (
    <Draggable draggableId={course} index={index}>
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
