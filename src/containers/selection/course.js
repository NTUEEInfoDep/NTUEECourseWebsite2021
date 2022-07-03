// import { Container } from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
  styledCourse: {
    // backgroundImage: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", // #eee
    opacity: 1.0,
    border: '2px solid rgba(178, 235, 242, 0.5)',
    borderRadius: 3, // 4
    padding: "15px 5px", // 4px, 8px
    //transition: "background-color .8s ease-out",
    marginTop: 8,
    color: "white", //#071214
    height: 45,
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    //textAlign: "center",
    // fontFamily: "Times, Times New Roman, serif",
    //opacity: 1.0,
    zIndex: 1,
    webkitTransition: "backgroundColor .2s linear ",

    "&:hover": {
      backgroundColor: "rgba(178, 235, 242, 0.08)",
      transition: "background-color .1s ease-in",
    },
  },
});
const Course = (props) => {
  const { course, index } = props;
  const classes = useStyles();
  // let hover = false;
  return (
    <Draggable draggableId={course} index={index}>
      {(provided) => (
        <div
          //className={classes.styledCourse}//clsx(classes.styledCourse,{[classes.hover]: hover})}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItem className={classes.styledCourse} button>
            <ListItemText primary={`${index + 1}. ${course}`}/>
          </ListItem>
          {/* {index + 1}
          {course} */}
        </div>
      )}
    </Draggable>
  );
};

Course.propTypes = {
  course: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default Course;
