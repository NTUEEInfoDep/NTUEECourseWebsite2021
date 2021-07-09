import { Container } from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";

const Course = ({ courseId, course, index }) => {
  return (
    <Draggable draggableId={courseId} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          {course}
        </Container>
      )}
      ;
    </Draggable>
  );
};

Course.propTypes = {
  courseId: PropTypes.string.isRequired,
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.string.isRequired,
};

export default Course;