module.exports = Object.freeze({
  START_TIME_KEY: "start",
  END_TIME_KEY: "end",

  AUTHORITY_USER: 0,
  AUTHORITY_MAINTAINER: 1,
  AUTHORITY_ADMIN: 2,

  SALT_ROUNDS: 10,
  COURSE_TYPE: ["none", "higher-grade-first", "customized"],
  PRIORITY_TYPE: [
    "higher-grade-first",
    "grades",
    "guarantee-third-grade",
    "guarantee-fourth-grade",
    "none",
    "",
  ],
});
