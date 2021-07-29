import React from "react";
import { List, Typography } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Course from "./course";

const useStyles = makeStyles({
  styledColumn1: {
    padding: "4px 0", //12px 0
    display: "flex",
    flexDirection: "column",
    marginTop: 2, //8
    textAlign: "center",
    fontFamily: "Arial, serif",//"Gill Sans, sans-serif",
    fontWeight: 100,
    // h2: {
    //   margin: 0,
    //   padding: "0 8px", //16px
    // },
  },
  styledList: {
    backgroundColor: "#121212", // #ddd B4F8C8
    //opacity: .9,
    borderRadius: 5, //8
    padding: 16,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginTop: 4,
    textAlign: "center",
    border: 4,
    borderColor: "pink",
  },
});
const Column = (props) => {
  const { columnId, title, column } = props;
  const classes = useStyles();
  return (
    <Droppable droppableId={title}>
      {(provided) => (
        <div className={classes.styledColumn1}>
          <Typography variant="h6">{title}</Typography>  
          <List // h2(replace typography)
            className={classes.styledList}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {column
              ? column.map((element, index) => (
                  <Course key={element} course={element} index={index} />
                ))
              : null}
            {provided.placeholder}
          </List>
        </div>
      )}
    </Droppable>
  );
};

Column.propTypes = {
  column: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Column;
// Column.propTypes = {
//   column: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     optionIds: PropTypes.arrayOf(PropTypes.string),
//   }).isRequired,
//   columnId: PropTypes.string.isRequired,
//   // options: PropTypes.arrayOf(
//   //   PropTypes.shape({
//   //     id: PropTypes.string.isRequired,
//   //     content: PropTypes.string.isRequired,
//   //   })
//   // ).isRequired,
// };
