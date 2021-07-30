import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Column from "./column";
import { SelectAPI } from "../../api";
import Loading from "../../components/loading";

//MdEditor
import MDEditor from "@uiw/react-md-editor";

const useStyles = makeStyles((theme) => ({
  styledColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    margin: "5vh auto",
    width: "80%",
    height: "80vh",
    gap: "8px",
    [theme.breakpoints.down("sm")]: {
      margin: "1vh auto",
      width: "95%",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
  },
}));
const Selection = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
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
    if (!data) return;
    try {
      await SelectAPI.putSelections(courseId, data.selected);
      // setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [data]);

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
      unselected: [...data.unselected],
    };
    const [remove] = newSelection[source.droppableId].splice(source.index, 1);
    newSelection[destination.droppableId].splice(destination.index, 0, remove);
    setData((state) => ({
      ...state,
      selected: newSelection.selected,
      unselected: newSelection.unselected,
    }));
  };

  return (
    <>
      {data && data.description && (
        <div
          style={{
            width: "90%",
            padding: "10px",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "10px",
            border: "1px white solid",
            borderRadius: "4px",
          }}
        >
          <h2 style={{ marginTop: "0px" }}>Introduction</h2>
          <MDEditor.Markdown source={data.description} />
        </div>
      )}
      {data ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={classes.styledColumns}>
            <Column
              title="已選課程"
              droppableId="selected"
              column={data.selected}
            />
            <Column
              title="未選課程"
              droppableId="unselected"
              column={data.unselected}
            />
          </div>
        </DragDropContext>
      ) : (
        <Loading />
      )}
    </>
  );
};
export default Selection;
