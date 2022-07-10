import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DragDropContext } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import ClassIcon from "@material-ui/icons/Class";
import ViewCarouselIcon from "@material-ui/icons/ViewCarousel";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
// import initialData from "./initial-data";
import MDEditor from "@uiw/react-md-editor";
import Column from "./column";
import { SelectAPI } from "../../api";
import Loading from "../../components/loading";

// MdEditor

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
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));
const Selection = () => {
  // const selected = courseName.selected;
  // const unselected = courseName.unselected;
  // const handleSelectCourse = (selectedID) => {
  //   setSelectedCourse(courses.find(({ courseID }) => courseID === selectedID));
  // };
  const history = useHistory();
  const theme = useTheme();
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [effectUpdate, setEffectUpdate] = useState(false);
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
    if (!effectUpdate) {
      setEffectUpdate(true);
      return;
    }
    try {
      await SelectAPI.putSelections(courseId, data.selected);
      setOpen(true);
      // setData(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [data]);
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    console.log("close");
  }
  function handleHomeClick() {
    history.push(``);
    // event.preventDefault();
    // console.info('You clicked a breadcrumb.');
  }
  function handleCoursesClick() {
    history.push(`/courses`);
  }
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
      {data ? (
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component="button"
            color="inherit"
            // href="/"
            onClick={handleHomeClick}
            className={classes.link}
          >
            <HomeIcon className={classes.icon} />
            <Typography>Main</Typography>
            
          </Link>
          <Link
            component="button"
            color="inherit"
            // href="/courses"
            onClick={handleCoursesClick}
            className={classes.link}
          >
            <ClassIcon className={classes.icon} />
            <Typography>Courses</Typography>
          </Link>
          <Typography color="textPrimary" className={classes.link}>
            <ViewCarouselIcon className={classes.icon} />
            {data.name}
          </Typography>
        </Breadcrumbs>
      ) : (
        ""
      )}
      {data && data.description && (
        <div
          style={{
            width: "90%",
            padding: "10px",
            marginTop: "15px",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "10px",
            border: "1px white solid",
            borderRadius: "4px",
          }}
        >
          <h2 style={{ marginTop: "0px" }}>Introduction</h2>
          <MDEditor.Markdown source={data.description} style={{ color: "inherit", backgroundColor: "inherit" }} />
        </div>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Successfully saved!
        </Alert>
      </Snackbar>
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
