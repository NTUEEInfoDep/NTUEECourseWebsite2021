import React from "react";
import { List } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Course from "./course";

const useStyles = makeStyles({
  styledColumn: {
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
    marginTop: 8,
    textAlign: "center",
    h2: {
      margin: 0,
      padding: "0 16px",
    },
  },
  styledList: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginTop: 8,
    textAlign: "center",
  },
});
const Column = ({ columnId, title, column }) => {
  const classes = useStyles();
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div className={classes.styledColumn}>
          <h2>{title}</h2>
          <List
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
