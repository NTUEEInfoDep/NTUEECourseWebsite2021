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
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { 
  makeStyles,
  ThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
// import initialData from "./initial-data";
import Column from "./column";
import { SelectAPI } from "../../api";
import Loading from "../../components/loading";

const useStyles = makeStyles((theme) => ({
  styledColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    margin: "10vh auto",
    width: "80%",
    height: "80vh",
    gap: "8px",
    [theme.breakpoints.down("sm")]: {
      margin: "1vh auto",
      width: "90%",
    }
  },
}));
const Selection = () => {
  // const selected = courseName.selected;
  // const unselected = courseName.unselected;
  // const handleSelectCourse = (selectedID) => {
  //   setSelectedCourse(courses.find(({ courseID }) => courseID === selectedID));
  // };
  const theme = useTheme();
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  // const [columns, setColumns] = useState(initialData);
  const classes = useStyles();

  useEffect(async () => {
    try {
      const res = await SelectAPI.getSelections(courseId);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []); // only run the first time
  useEffect(async () => {
    try {
      await SelectAPI.putSelections(courseId, data.selected);
      // setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [data]);
  // const { name, type, description, selected, unselected } = data;
  // return (
  //   <>
  //     {data ? (
  //       <div>
  //         <h1>Thisa is course Selection page</h1>
  //         {courseId}
  //         {data.description}
  //         {data.name}
  //         {data.selected}
  //         {}
  //       </div>
  //     ) : (
  //       Loading
  //     )}
  //   </>
  // );

  // function handleSelection(course) {
  //   setColumns((state) => [
  //     {
  //       ...state[0],
  //       // optionIds: state.courses.find(({ id }) => id === selectedID)
  //       //   .optionIds,
  //     },
  //     {
  //       ...state[1],
  //       optionIds: course.unselected,
  //     },
  //   ]);
  // }
  // // console.log(data);
  // handleSelection(data);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newSelection = {
      selected: [...data.selected],
      unselect: [...data.unselected],
    };
    const [remove] = newSelection[source.droppableId].splice(source.index, 1);
    newSelection[destination.droppableId].splice(destination.index, 0, remove);
    setData((state) => ({
      ...state,
      selected: newSelection.selected,
      unselected: newSelection.unselect,
    }));
    // useEffect(async () => {
    //   try {
    //     await SelectAPI.putSelections(data.selected);
    //     // setData(res.data);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }, [data]);
  };
  return (
    <>
      {data ? (
        <ThemeProvider theme={theme}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classes.styledColumns}>
            <Column key="selected" title="selected" column={data.selected} />
            <Column
              key="unselect"
              title="unselect"
              column={data.unselected}
            />
          </div>
        </DragDropContext>
        </ThemeProvider>
      ) : (
        Loading
      )}
    </>
  );
};
export default Selection;
// const onDragEnd = (result) => {
//   const { destination, source, draggableId } = result;

//   if (!destination) {
//     return;
//   }

//   if (
//     destination.droppableId === source.droppableId &&
//     destination.index === source.index
//   ) {
//     return;
//   }

//   const startcolumn = columns[source.droppableId];
//   const endcolumn = columns[destination.droppableId];

//   if (startcolumn === endcolumn) {
//     const newOptionIds = Array.from(startcolumn.optionIds);
//     newOptionIds.splice(source.index, 1);
//     newOptionIds.splice(destination.index, 0, draggableId);

//     const newColumn = {
//       ...startcolumn,
//       optionIds: newOptionIds,
//     };
//     if (source.droppableId === 0) {
//       setColumns((state) => [newColumn, ...state[1]]);
//     } else {
//       setColumns((state) => [...state[0], newColumn]);
//     }
//   } else {
//     const newOptionIds = Array.from(startcolumn.optionIds);
//     newOptionIds.splice(source.index, 1);

//     const newStartCol = {
//       ...startcolumn,
//       optionIds: newOptionIds,
//     };
//     const newEnd = Array.from(endcolumn.optionIds);
//     newEnd.splice(destination.index, 0, newOptionIds[source.index]);
//     const newEndCol = {
//       ...endcolumn,
//       optionIds: newEnd,
//     };
//     if (source.droppableId === 0) {
//       setColumns(() => [newStartCol, newEndCol]);
//     } else {
//       setColumns(() => [newEndCol, newStartCol]);
//     }
//   }
// };
// return (
//   <>
//     {data ? (
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className={classes.styledColumns}>
//           {columns.map((column) => {
//             // const column = columns.columnId;
//             // const options = column.optionIds; // .map((courseId) => courses[courseId]);
//             return (
//               <Column
//                 key={column.id}
//                 column={column}
//                 options={column.optionIds}
//               />
//             );
//           })}
//         </div>
//       </DragDropContext>
//     ) : (
//       Loading
//     )}
//   </>
// );
// };
