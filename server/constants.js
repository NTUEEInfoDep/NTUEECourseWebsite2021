module.exports = Object.freeze({
  START_TIME_KEY: "start",
  END_TIME_KEY: "end",

  AUTHORITY_USER: 0,
  AUTHORITY_MAINTAINER: 1,
  AUTHORITY_ADMIN: 2,

  MODEL: [
    [
      "Course",
      "CourseAtlas",
      ["id", "name", "type", "description", "number", "students", "options"],
    ],
    [
      "Student",
      "StudentAtlas",
      ["userID", "grade", "password", "name", "authority"],
    ],
    ["Selection", "SelectionAtlas", ["courseID", "userID", "name", "ranking"]],
    ["Preselect", "PreselectAtlas", ["userID"]],
    ["OpenTime", "OpenTimeAtlas", ["type", "time"]],
    ["Result", "ResultAtlas", ["studentID", "courseName", "optionName"]],
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
