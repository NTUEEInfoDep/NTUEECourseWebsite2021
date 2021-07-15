import React from "react";
import { Container, List } from "@material-ui/core";
import { Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import Course from "./course";

const Column = ({ columnId, column, options }) => {
  return (
    <Container>
      <h2>{column[columnId].title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <List innerRef={provided.innerRef} {...provided.droppableProps}>
            {/* {courses.map((course) => (
              <Course key={course.id} course={course} index={columnId} />
            ))} */}
            {options.forEach((element) => {
              <Course key={element} course={element} index={columnId} />;
            })}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Container>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    courseId: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  columnId: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Column;
