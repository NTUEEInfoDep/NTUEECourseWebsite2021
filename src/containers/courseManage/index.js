import React, { useState, useEffect } from "react";

// material-ui
import {
  Grid,
  Paper,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CourseTable from "./CourseTable";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1000px",
    padding: "35px",
    "& > *": {
      margin: "auto",
    },
  },
  input: {
    display: "none",
  },
}));

const typeData = [
  {
    id: "0",
    text: "十選二實驗",
  },
  {
    id: "1",
    text: "大一",
  },
  {
    id: "2",
    text: "大二",
  },
  {
    id: "3",
    text: "大三",
  },
];

/**
 * Course Management Page
 */
export default function CourseManage() {
  const classes = useStyles();
  // get courses
  const types = typeData;
  const [remote, setRemote] = useState([]);
  const [courses, setCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    // const courseData = axios.get("/api/courses");
    // const typeData = axios.get("/api/grades");
    // eslint-disable-next-line no-use-before-define
    setRemote(dummyCourses);
    setCourses(dummyCourses);
  }, []);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    setRemote(courses);
  };

  const reorderCourse = (index, offset) => {
    const excluded = [...courses.slice(0, index), ...courses.slice(index + 1)];
    const position = index + offset;
    setCourses([
      ...excluded.slice(0, position),
      courses[index],
      ...excluded.slice(position),
    ]);
  };

  return (
    <div>
      <Grid container spacing={3} direction="row">
        <Grid item sm={12}>
          <Button onClick={handleOpen} variant="contained" color="primary">
            Add Course
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Grid>
        <Grid item sm={12}>
          <CourseTable
            courses={courses}
            typeData={typeData}
            reorderCourse={reorderCourse}
          />
        </Grid>
      </Grid>
      <Dialog maxWidth="md" fullWidth open={dialogOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">Add Course</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Specify ID
          </DialogContentText>
          <TextField id="id" label="Course ID" type="text" fullWidth />
          <TextField id="name" label="Course Name" type="text" fullWidth />
          <Select
            inputProps={{
              name: "max-width",
              id: "max-width",
            }}
            fullWidth
          >
            {[{ id: "-", text: "Select Course Type..." }, ...typeData].map(
              (type) => (
                <MenuItem
                  key={type.id}
                  value={type.id}
                  default={type.id === "-"}
                >
                  {type.text}
                </MenuItem>
              )
            )}
          </Select>
          <TextField
            id="desc"
            label="Description (HTML)"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const dummyCourses = [
  {
    id: "Ten-Select-Two",
    name: "十選二實驗",
    type: "0",
    description:
      '<p>(1) 請詳閱 <a href="https://bit.ly/3o0MrAb" target="_blank" style="color: #45bbff;">實驗規定</a>，攸關各位的權利。</p><p>(2)特別轉載半導體實驗規定： ★★大學畢業後欲投入半導體領域者，可保留名額  ★★實驗期間需全程戴口罩、穿實驗衣含無塵衣,且著裝後需能自由移動。  ★★需遵守政府、臺大及實驗室之公共安全規定。  ★★環安衛法律條文規定沒有英文部份,若有外藉生不懂中文,將請助教以英文口譯告知。  ★★Electrical Engineering Lab (semiconductor) safety rules: ★In the labs,  students are required to wear  masks and lab  coats /cleanroom suits, and can be able to move freely with the  coats/suits.  ★★All persons in labs must follow the related safety regulations required by the labs, NTU, and the government.  ★★Enrolled international students  will be informed by teaching assistants orally in case that the English regulations/statutes of occupational health and safety, and environmental protection are not officially available.</p><p>(3) 數電請進入 <a href="https://forms.gle/kJowuD9SynDYQpjB6" target="_blank" style="color: #45bbff;">此表單</a> 報名。</p>',
    options: [
      "電力電子",
      "自動控制",
      "嵌入式系統",
      "電磁波",
      "半導體",
      "通信專題",
      "網路與多媒體",
      "生醫工程",
      "光電",
    ],
  },
  {
    id: "Electronic-Circuit",
    name: "電路學",
    type: "1",
    description: "",
    options: ["老師A", "老師B", "老師C", "老師D", "老師E"],
  },
  {
    id: "Electronics-two",
    name: "電子學（二）",
    type: "2",
    description: "",
    options: ["老師F", "老師G", "老師H", "老師I"],
  },
  {
    id: "Electormagnetics-two",
    name: "電磁學二",
    type: "2",
    description: "",
    options: ["老師J", "老師K", "老師L", "老師M", "老師N"],
  },
  {
    id: "Signals-Systems",
    name: "信號與系統",
    type: "2",
    description: "",
    options: ["老師O", "老師P", "老師Q", "老師R"],
  },
  {
    id: "Probability-Statistics",
    name: "機率與統計",
    type: "2",
    description: "",
    options: ["老師S", "老師T", "老師U"],
  },
  {
    id: "Algorithm",
    name: "演算法",
    type: "3",
    description: "",
    options: ["老師V"],
  },
];
