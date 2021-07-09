// import React from "react";
// import PropTypes from "prop-types";

// /**
//  * This is Main Page
//  */
// export default function Selection({
//   course: { id, name, type, description, options },
// }) {
//   return (
//     <div>
//       <h1>This is Course Selection Popup</h1>
//       {id} {name} {type} {description}
//       {options.map((option) => (
//         <div key={option}>{option}</div>
//       ))}
//     </div>
//   );
// }

// Selection.propTypes = {
//   course: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     type: PropTypes.string.isRequired,
//     description: PropTypes.string.isRequired,
//     options: PropTypes.arrayOf(PropTypes.string).isRequired,
//   }).isRequired,
// };
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import initialData from "./initial-data";
import Column from "./column";

const Selection = (courseName) => {
  // const selected = courseName.selected;
  // const unselected = courseName.unselected;
  // const handleSelectCourse = (selectedID) => {
  //   setSelectedCourse(courses.find(({ courseID }) => courseID === selectedID));
  // };
  const [columns, setColumns] = useState(initialData);

  function handleSelection(course) {
    setColumns((state) => [
      {
        ...state[0],
        // optionIds: state.courses.find(({ id }) => id === selectedID)
        //   .optionIds,
        optionIds: course.selected,
      },
      {
        ...state[1],
        optionIds: course.unselected,
      },
    ]);
  }
  handleSelection(courseName);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startcolumn = columns[source.droppableId];
    const endcolumn = columns[destination.droppableId];

    if (startcolumn === endcolumn) {
      const newOptionIds = Array.from(startcolumn.optionIds);
      newOptionIds.splice(source.index, 1);
      newOptionIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startcolumn,
        optionIds: newOptionIds,
      };
      if (source.droppableId === 0) {
        setColumns((state) => [newColumn, { ...state[1] }]);
      } else {
        setColumns((state) => [{ ...state[0] }, newColumn]);
      }
    } else {
      const newOptionIds = Array.from(startcolumn.optionIds);
      newOptionIds.splice(source.index, 1);

      const newStartCol = {
        ...startcolumn,
        courseIds: newOptionIds,
      };
      const newEnd = Array.from(endcolumn.optionIds);
      newEnd.splice(destination.index, 0, newOptionIds[source.index]);
      const newEndCol = {
        ...endcolumn,
        optionIds: newEnd,
      };
      if (source.droppableId === 0) {
        setColumns(() => [newStartCol, newEndCol]);
      } else {
        setColumns(() => [newEndCol, newStartCol]);
      }
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {columns.map((column) => {
        // const column = columns.columnId;
        // const options = column.optionIds; // .map((courseId) => courses[courseId]);
        return (
          <Column key={column.id} column={column} options={column.optionIds} />
        );
      })}
    </DragDropContext>
  );
};
export default Selection;
