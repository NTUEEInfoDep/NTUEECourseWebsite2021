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
    immutable: true,
  },
  type: {
    type: String,
    required: true,
    immutable: true,
  },
  description: {
    type: String,
    immutable: true,
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
    immutable: true,
  },
  password: {
    type: String,
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
    immutable: true,
  },
  authority: {
    type: String,
    required: true,
    immutable: true,
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
