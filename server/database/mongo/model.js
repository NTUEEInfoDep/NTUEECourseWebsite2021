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
  options: [String],
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
    type: String,
    required: true,
    immutable: false,
  },
  selections,
});

const Student = mongoose.model("Student", userSchema);

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

module.exports = {
  Course,
  Student,
  OpenTime,
};
