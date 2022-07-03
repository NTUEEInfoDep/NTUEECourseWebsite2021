module.exports = Object.freeze({
  START_TIME_KEY: "start",
  END_TIME_KEY: "end",

  AUTHORITY_USER: 0,
  AUTHORITY_MAINTAINER: 1,
  AUTHORITY_ADMIN: 2,

  MODEL: [
    [
      "Course",
      "courseSchema",
      ["id", "name", "type", "description", "number", "students", "options"],
    ],
    [
      "Student",
      "userSchema",
      ["userID", "grade", "password", "name", "authority"],
    ],
    ["Selection", "selectionSchema", ["courseID", "userID", "name", "ranking"]],
    ["OpenTime", "openTimeSchema", ["type", "time"]],
    ["Result", "resultSchema", ["studentID", "courseName", "optionName"]],
  ],

  SALT_ROUNDS: 10,
  COURSE_TYPE: ["1", "2", "3", "4", "Ten-Select-Two", "EE-Lab"],
  PRIORITY_TYPE: [
    "higher-grade-first",
    "grades",
    "guarantee-third-grade",
    "guarantee-fourth-grade",
    "none",
    "",
    "preselect",
  ],
});
