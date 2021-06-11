const mongoose = require("mongoose");
const courses = require("../data/courses.json");

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
  options: [{ name: String, limit: Number }],
});

const Course = mongoose.model("Course", courseSchema);

// ========================================

const courseIDs = courses.map((course) => course.id);
const selections = {};
courseIDs.forEach((courseID) => {
  selections[courseID] = [String];
});

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
  selections,
});

const Student = mongoose.model("Student", userSchema);

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

const Selection = mongoose.model("Selection", selectionSchema);

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

const OpenTime = mongoose.model("OpenTime", openTimeSchema);

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

const Result = mongoose.model("Result", resultSchema);

// ========================================

module.exports = {
  Course,
  Student,
  Selection,
  OpenTime,
  Result,
};
