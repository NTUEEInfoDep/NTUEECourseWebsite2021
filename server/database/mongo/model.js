const mongoose = require("mongoose");
// const courses = require("../data/courses.json");
// const { conn, conn_atlas } = require("./connection");
require("dotenv").config();

const { MONGO_HOST, MONGO_DBNAME } = process.env;
const conn = mongoose.createConnection(
  `mongodb://${MONGO_HOST}/${MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ========================================

const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
    immutable: false,
  },
  type: {
    type: String,
    required: true,
    immutable: false,
  },
  description: {
    type: String,
    immutable: false,
  },
  number: {
    type: Number,
    required: true,
    immutable: false,
  },
  students: {
    type: [String],
    required: true,
    immutable: false,
  },
  options: [
    {
      name: String,
      limit: Number,
      priority_type: String,
      priority_value: {},
    },
  ],
});

const Course = conn.model("Course", courseSchema);

// ========================================

// const courseIDs = courses.map((course) => course.id);
// const selections = {};
// courseIDs.forEach((courseID) => {
//   selections[courseID] = [String];
// });

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    immutable: true,
  },
  grade: {
    type: Number,
    required: true,
    immutable: false,
  },
  password: {
    type: String,
    required: true,
    immutable: false,
  },
  name: {
    type: String,
    required: true,
    immutable: false,
  },
  authority: {
    type: Number,
    required: true,
    immutable: false,
  },
  // selections,
});

const Student = conn.model("Student", userSchema);

// ========================================

const selectionSchema = new mongoose.Schema({
  courseID: {
    type: String,
    required: true,
    immutable: true,
  },
  userID: {
    type: String,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
    immutable: true,
  },
  ranking: {
    type: Number,
    required: true,
    immutable: true,
  },
});

const Selection = conn.model("Selection", selectionSchema);

// ========================================

// 只有數電實驗需要
const preselectSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    immutable: true,
  },
});

const Preselect = conn.model("Preselect", preselectSchema);

// ========================================

const openTimeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    immutable: true,
  },
  time: {
    type: Number,
    required: true,
    immutable: false,
  },
});

const OpenTime = conn.model("OpenTime", openTimeSchema);

// ========================================

const resultSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    immutable: true,
  },
  courseName: {
    type: String,
    required: true,
    immutable: true,
  },
  optionName: {
    type: String,
    required: true,
    immutable: true,
  },
});

const Result = conn.model("Result", resultSchema);

const conn_atlas = mongoose.createConnection(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const CourseAtlas = conn_atlas.model("Course", courseSchema);
const StudentAtlas = conn_atlas.model("Student", userSchema);
const SelectionAtlas = conn_atlas.model("Selection", selectionSchema);
const PreselectAtlas = conn_atlas.model("Preselect", preselectSchema);
const OpenTimeAtlas = conn_atlas.model("OpenTime", openTimeSchema);
const ResultAtlas = conn_atlas.model("Result", resultSchema);

// ========================================

module.exports = {
  Course,
  Student,
  Selection,
  Preselect,
  OpenTime,
  Result,
  conn,
  CourseAtlas,
  StudentAtlas,
  SelectionAtlas,
  PreselectAtlas,
  OpenTimeAtlas,
  ResultAtlas,
  conn_atlas,
};
