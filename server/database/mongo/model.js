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
  selections,
});

const Student = mongoose.model("Student", userSchema);

// ========================================

const openTimeSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    immutable: false,
  },
  month: {
    type: String,
    required: true,
    immutable: false,
  },
  day: {
    type: String,
    required: true,
    immutable: false,
  },
  hour: {
    type: String,
    required: true,
    immutable: false,
  },
  minutes: {
    type: String,
    required: true,
    immutable: false,
  },
});

const StartTime = mongoose.model("StartTime", openTimeSchema);
const EndTime = mongoose.model("EndTime", openTimeSchema);

// ========================================

module.exports = {
  Course,
  Student,
  StartTime,
  EndTime,
};
