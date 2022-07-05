const uuid = require("node-uuid");

const express = require("express");
const session = require("express-session");
const asyncHandler = require("express-async-handler");
const redis = require("redis");
const connectRedis = require("connect-redis");
const bcrypt = require("bcrypt");
const deprecate = require("depd")("ntuee-course:api");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const csvStringify = require("csv-stringify");
const { promisify } = require("util");

const { string } = require("yargs");
const constants = require("./constants");
const model = require("./database/mongo/model");

// ========================================

const csvStringifyPromise = promisify(csvStringify);

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

const {
  REDIS_HOST,
  REDIS_PORT,
  DISTRIBUTE_SERVER_HOST,
  DISTRIBUTE_SERVER_PORT,
} = process.env;

// ========================================

const router = express.Router();

const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);
redisClient.on("error", console.error);

// ========================================
// Date verification middleware

const openTimeMiddleware = asyncHandler(async (req, res, next) => {
  const startTime = await model.OpenTime.findOne({
    type: constants.START_TIME_KEY,
  }).exec();
  const endTime = await model.OpenTime.findOne({
    type: constants.END_TIME_KEY,
  }).exec();
  const now = Math.floor(new Date() / 1000);
  if (
    (now < startTime.time || now > endTime.time) &&
    req.session.authority < constants.AUTHORITY_MAINTAINER
  ) {
    res.status(503).send({ start: startTime.time, end: endTime.time });
    return;
  }
  next();
});

const loginRequired = asyncHandler(async (req, res, next) => {
  if (!req.session.userID) {
    res.status(403).end();
    return;
  }
  next();
});

const permissionRequired = (permission) =>
  asyncHandler(async (req, res, next) => {
    if (!req.session.authority || req.session.authority < permission) {
      res.status(403).end();
      return;
    }
    next();
  });

// ========================================
// Session middleware

const secret = uuid.v4();

const RedisStore = connectRedis(session);

const sessionOptions = {
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: null,
  },
  resave: false,
  saveUninitialized: false,
  secret,
  unset: "destroy",
  store: new RedisStore({
    client: redisClient,
    prefix: "ntuee-course-session:",
  }),
};

// clear all sessions in redis
sessionOptions.store.clear();

if (process.env.NODE_ENV === "production") {
  sessionOptions.cookie.secure = true; // Need https
  if (!sessionOptions.cookie.secure) {
    deprecate("Recommend to set secure cookie session if has https!\n");
  } else {
    console.log("Secure cookie is on");
  }
}

router.use(session(sessionOptions));

// ========================================

router
  .route("/session")
  .get(
    loginRequired,
    asyncHandler(async (req, res, next) => {
      res.status(200).send({
        userID: req.session.userID,
        authority: req.session.authority,
      });
    })
  )
  .post(
    express.urlencoded({ extended: false }),
    asyncHandler(async (req, res, next) => {
      let { userID } = req.body;
      const { password } = req.body;

      if (!userID || !password) {
        res.status(400).end();
        return;
      }
      userID = userID.toUpperCase();

      const user = await model.Student.findOne({ userID }).exec();
      if (!user) {
        res.status(400).end();
        return;
      }
      const passwordHash = user.password;
      const { name } = user;
      const { authority } = user;

      // Check password with the passwordHash
      const match = await bcrypt.compare(password, passwordHash);
      if (!match) {
        res.status(401).end();
        return;
      }

      req.session.userID = userID;
      req.session.name = name;
      req.session.authority = authority;
      res.status(200).send({ userID, authority });
    })
  )
  .delete(
    asyncHandler(async (req, res, next) => {
      req.session = null;
      res.status(204).end();
    })
  );

router
  .route("/opentime")
  .get(
    asyncHandler(async (req, res, next) => {
      const start = await model.OpenTime.findOne({
        type: constants.START_TIME_KEY,
      });
      const end = await model.OpenTime.findOne({
        type: constants.END_TIME_KEY,
      });
      res.status(200).send({ start: start.time, end: end.time });
    })
  )
  .put(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const { start } = req.body;
      const { end } = req.body;
      if (typeof start !== "number" || typeof end !== "number") {
        res.status(400).end();
        return;
      }
      if (start < 0 || end < 0) {
        res.status(400).end();
        return;
      }

      await model.OpenTime.updateOne(
        { type: constants.START_TIME_KEY },
        { time: start }
      );
      await model.OpenTime.updateOne(
        { type: constants.END_TIME_KEY },
        { time: end }
      );
      res.status(204).end();
    })
  );

router.use(openTimeMiddleware).get(
  "/courses",
  loginRequired,
  asyncHandler(async (req, res, next) => {
    const coursesGroup = await model.Course.find({}).exec();
    const filtered = [];
    const items = Object.keys(req.query);

    coursesGroup.forEach((course) => {
      const filteredcourse = {};
      filteredcourse.id = course.id;
      items.forEach((item) => {
        filteredcourse[item] = course[item];
      });
      filtered.push(filteredcourse);
    });

    res.send(filtered);
  })
);

router.route("/password").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const modifiedData = req.body;
    let ERROR_INPUT = false;
    mongoose.set("useFindAndModify", false);

    if (!modifiedData || !Array.isArray(modifiedData)) {
      res.status(400).end();
      return;
    }

    // check input type
    modifiedData.forEach((data) => {
      // check if attribute userID,new_password exist
      if (!data.userID || !data.new_password) {
        ERROR_INPUT = true;
      }
      // check if input is string
      if (
        typeof data.new_password !== "string" ||
        typeof data.userID !== "string"
      ) {
        ERROR_INPUT = true;
      }
    });
    if (ERROR_INPUT) {
      res.status(400).end();
      return;
    }

    await Promise.all(
      modifiedData.map(async (data) => {
        const salt = await bcrypt.genSalt(constants.SALT_ROUNDS);
        const newpasswordHash = await bcrypt.hash(data.new_password, salt);
        const filter = { userID: data.userID.toUpperCase() };
        const update = { password: newpasswordHash };
        const result = await model.Student.findOneAndUpdate(filter, update);
      })
    );

    res.status(204).end();
  })
);

router
  .route("/users")
  .all(openTimeMiddleware)
  .get(
    permissionRequired(constants.AUTHORITY_MAINTAINER),
    asyncHandler(async (req, res, next) => {
      const studentGroup = await model.Student.find({}).exec();
      const filtered = [];
      const items = Object.keys(req.query);
      let pass = true;
      studentGroup.forEach((student) => {
        const filteredstudent = {};
        filteredstudent.id = student.userID;
        items.forEach((item) => {
          if (item === "password") {
            pass = false;
          }
          filteredstudent[item] = student[item];
        });
        filtered.push(filteredstudent);
      });
      if (!pass) {
        res.status(403).end();
        return;
      }
      res.send(filtered);
    })
  )
  .post(
    express.json({ extended: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const studentsRaw = req.body;
      const students = [];
      let cnt = 0;
      let pass = true;
      if (!studentsRaw || !Array.isArray(studentsRaw)) {
        res.status(400).end();
        return;
      }
      studentsRaw.forEach((studentRaw) => {
        if (
          typeof studentRaw.authority !== "number" ||
          typeof studentRaw.grade !== "number" ||
          typeof studentRaw.userID !== "string" ||
          typeof studentRaw.password !== "string" ||
          typeof studentRaw.name !== "string"
        ) {
          pass = false;
        }
      });
      if (!pass) {
        res.status(400).end();
        return;
      }
      await Promise.all(
        studentsRaw.map(async (studentRaw) => {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(studentRaw.password, salt);
          const student = { ...studentRaw };
          student.password = hash;
          student.userID = student.userID.toUpperCase();
          const match = await model.Student.findOne({
            userID: student.userID,
          }).exec();
          if (!match) {
            cnt += 1;
            students.push(student);
          }
        })
      );
      console.log("All passwords are hashed!");
      // Save all students
      await Promise.all(
        students.map(async (student) => {
          const studentDocument = new model.Student(student);
          await studentDocument.save();
        })
      );
      console.log(`Successfully update ${cnt} students`);
      res.status(204).end();
    })
  )
  .delete(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const deleteData = req.body;
      const deleteData_new = [];
      if (!deleteData || !Array.isArray(deleteData)) {
        res.status(400).end();
        return;
      }
      deleteData.forEach((userID) => {
        if (typeof userID === "string") {
          deleteData_new.push(userID);
        }
      });
      await Promise.all(
        deleteData_new.map(async (data) => {
          const userID = data.toUpperCase();
          const student = await model.Student.findOne({ userID }).exec();
          if (student) {
            await model.Student.deleteOne({ userID });
          }
        })
      );
      res.status(204).end();
    })
  )
  .put(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_ADMIN),
    asyncHandler(async (req, res, next) => {
      const modifiedData = req.body;
      const modifiedData_new = [];
      if (!modifiedData || !Array.isArray(modifiedData)) {
        res.status(400).end();
        return;
      }
      // if the element in addData is not a valid Course type, remove it from addData
      modifiedData.forEach((data) => {
        if (typeof data.userID === "string") {
          modifiedData_new.push(data);
        }
      });
      await Promise.all(
        modifiedData_new.map(async (data) => {
          let { userID } = data;
          const { authority } = data;
          const { grade } = data;
          let { password } = data;
          const { name } = data;
          const salt = await bcrypt.genSalt(10);
          userID = userID.toUpperCase();
          const student = await model.Student.findOne({ userID }).exec();
          if (student) {
            if (password) {
              const hash = await bcrypt.hash(password, salt);
              password = hash;
              await model.Student.updateOne(
                {
                  userID,
                },
                {
                  authority,
                  grade,
                  password,
                  name,
                }
              );
            } else {
              await model.Student.updateOne(
                {
                  userID,
                },
                {
                  authority,
                  grade,
                  name,
                }
              );
            }
          }
        })
      );
      res.status(204).end();
    })
  );

router
  .route("/selections/:courseID")
  .all(
    openTimeMiddleware,
    loginRequired,
    asyncHandler(async (req, res, next) => {
      const { courseID } = req.params;
      const course = await model.Course.findOne(
        { id: courseID },
        "name type description options students number"
      );
      if (!course) {
        res.sendStatus(404);
        return;
      }
      const { students } = course;
      if (students.length > 0 && !students.includes(req.session.userID)) {
        res.sendStatus(403);
        return;
      }
      req.course = course;
      next();
    })
  )
  .get(
    asyncHandler(async (req, res, next) => {
      const { courseID } = req.params;
      const { userID } = req.session;
      const { name, type, description, options, number } = req.course;
      let selected = await model.Selection.find({ userID, courseID }).sort({
        ranking: 1,
      });
      selected = selected.map((selection) => selection.name);
      const unselected = options
        .filter(
	  (option) => 
	    !selected.includes(option.name) &&
	    option.priority_type !== "preselect"
	)
        .map((selection) => selection.name);
      res.send({ name, type, description, selected, unselected, number });
    })
  )
  .put(
    express.json({ strict: false }),
    asyncHandler(async (req, res, next) => {
      const { userID } = req.session;
      const { courseID } = req.params;
      const { options } = req.course;
      const optionNames = options.map((option) => option.name);

      // Validation
      if (!Array.isArray(req.body)) {
        res.status(400).end();
        return;
      }
      if (!req.body.every((option) => optionNames.includes(option))) {
        res.status(400).end();
        return;
      }

      const update = [];
      req.body.forEach((item, index) => {
        update.push({ courseID, userID, name: item, ranking: index + 1 });
      });
      const resultDelete = await model.Selection.deleteMany({
        userID,
        courseID,
      });
      const result = await model.Selection.insertMany(update);
      res.status(204).end();
    })
  );

router.route("/result").get(
  openTimeMiddleware,
  loginRequired,
  asyncHandler(async (req, res, next) => {
    const { userID } = req.session;
    console.log(userID);
    const results = await model.Selection.find({ userID }).sort({
      courseID: 1,
      ranking: 1,
    });
    const courses = await model.Course.find({}, "id name");
    const coursesId2Name = {};
    await Promise.all(
      courses.map((course) => {
        coursesId2Name[course.id] = course.name;
      })
    );

    res.send({ results, coursesId2Name });
  })
);

router
  .route("/course")
  .all(openTimeMiddleware)
  .post(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_MAINTAINER),
    asyncHandler(async (req, res, next) => {
      const addData = req.body;
      const addData_new = [];
      let pass;
      if (!addData || !Array.isArray(addData)) {
        res.status(400).end();
        return;
      }
      // if the element in addData is not a valid Course type, remove it from addData
      addData.forEach((data) => {
        if (
          typeof data.id === "string" &&
          typeof data.name === "string" &&
          typeof data.type === "string" &&
          typeof data.description === "string" &&
          typeof data.options === "object" &&
          typeof data.students === "object" &&
          typeof data.number === "number" &&
          constants.COURSE_TYPE.includes(data.type)
        ) {
          pass = true;
          data.options.forEach((option) => {
            if (
              typeof option.name !== "string" ||
              typeof option.limit !== "number" ||
              typeof option.priority_type !== "string" ||
              (typeof option.priority_value !== "number" &&
                typeof option.priority_value !== "object") ||
              !constants.PRIORITY_TYPE.includes(option.priority_type)
            ) {
              pass = false;
            }
          });
          if (pass) {
            addData_new.push(data);
          }
        }
      });
      await Promise.all(
        addData_new.map(async (data) => {
          const { id, name, type, description, options, number, students } =
            data;
          const course = await model.Course.findOne({ id }).exec();
          const newStudents = students.map((student) => {
            return student.toUpperCase();
          });
          if (course) {
            await model.Course.deleteOne({ id }).exec();
          }
          const courseDocument = new model.Course({
            id,
            name,
            type,
            description,
            options,
            number,
            students: newStudents,
          });
          await courseDocument.save();
        })
      );
      res.status(201).end();
    })
  )
  .delete(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_MAINTAINER),
    asyncHandler(async (req, res, next) => {
      const deleteData = req.body;
      const deleteData_new = [];
      if (!deleteData || !Array.isArray(deleteData)) {
        res.status(400).end();
        return;
      }
      // if the element in addData is not a valid Course type, remove it from addData
      deleteData.forEach((id) => {
        if (typeof id === "string") {
          deleteData_new.push(id);
        }
      });
      await Promise.all(
        deleteData_new.map(async (id) => {
          const course = await model.Course.findOne({ id }).exec();
          if (course) {
            await model.Course.deleteOne({ id });
          }
        })
      );
      res.status(204).end();
    })
  )
  .put(
    express.json({ strict: false }),
    permissionRequired(constants.AUTHORITY_MAINTAINER),
    asyncHandler(async (req, res, next) => {
      const modifiedData = req.body;
      const modifiedData_new = [];
      if (!modifiedData || !Array.isArray(modifiedData)) {
        res.status(400).end();
        return;
      }
      // if the element in addData is not a valid Course type, remove it from addData
      modifiedData.forEach((data) => {
        if (typeof data.id === "string") {
          modifiedData_new.push(data);
        }
      });
      await Promise.all(
        modifiedData_new.map(async (data) => {
          const { id, name, type, description, options, number, students } =
            data;
          const course = await model.Course.findOne({ id }).exec();
          const newStudents = students.map((student) => {
            return student.toUpperCase();
          });
          if (course) {
            await model.Course.updateOne(
              {
                id,
              },
              {
                name,
                type,
                description,
                options,
                number,
                students: newStudents,
              }
            );
          }
        })
      );
      res.status(204).end();
    })
  );

router.route("/authority").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const modifiedData = req.body;
    const modifiedData_new = [];
    if (!modifiedData || !Array.isArray(modifiedData)) {
      res.status(400).end();
      return;
    }
    console.log(modifiedData);
    modifiedData.forEach((data) => {
      if (
        typeof data.userID === "string" &&
        typeof data.authority === "number"
      ) {
        modifiedData_new.push(data);
      }
    });
    await Promise.all(
      modifiedData_new.map(async (data) => {
        let { userID } = data;
        const { authority } = data;
        userID = userID.toUpperCase();
        const user = await model.Student.findOne({ userID }).exec();
        if (user) {
          await model.Student.updateOne({ userID }, { authority });
        }
      })
    );
    res.status(204).end();
  })
);

router.route("/preselect").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    // Validation
    if (!Array.isArray(req.body)) {
      res.status(400).end();
      return;
    }
    const update = req.body.map((userID) => {
      return { userID };
    });

    await model.Preselect.deleteMany({});
    await model.Preselect.insertMany(update);
    res.status(204).end();
  })
);

router.post(
  "/distribute",
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const resp = await fetch(
      `http://${DISTRIBUTE_SERVER_HOST}:${DISTRIBUTE_SERVER_PORT}/distribute`,
      {
        method: "POST",
      }
    );
    if (resp.ok) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  })
);

router.post(
  "/new_distribute",
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const resp = await fetch(
      `http://${DISTRIBUTE_SERVER_HOST}:${DISTRIBUTE_SERVER_PORT}/new_distribute`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(req.body),
      }
    );
    if (resp.ok) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  })
);

router.get(
  "/result.csv",
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const results = await model.Result.find({}).exec();
    const rows = [["studentID", "courseName", "optionName"]];
    results.forEach((result) => {
      rows.push([result.studentID, result.courseName, result.optionName]);
    });
    const output = await csvStringifyPromise(rows);
    res.setHeader("content-type", "application/csv");
    res.setHeader("content-disposition", "attachment; filename=result.csv");
    res.status(200).send(output);
  })
);

router.get(
  "/statistics.csv",
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const resp = await fetch(
      `http://${DISTRIBUTE_SERVER_HOST}:${DISTRIBUTE_SERVER_PORT}/statistics`,
      {
        method: "GET",
      }
    );
    const csvString = await resp.text();
    if (resp.ok) {
      res.setHeader("content-type", "application/csv");
      res.setHeader(
        "content-disposition",
        "attachment; filename=statistics.csv"
      );
      res.status(200).send(csvString);
    } else {
      res.status(400).end();
    }
  })
);

router.get(
  "/sample",
  permissionRequired(constants.AUTHORITY_MAINTAINER),
  asyncHandler(async (req, res, next) => {
    let { userID } = req.query;
    userID = userID.toUpperCase();
    const userData = await model.Student.findOne({ userID });
    const selectionData = await model.Selection.find({ userID }).sort({
      courseID: 1,
      ranking: 1,
    });
    const resultData = await model.Result.find({ studentID: userID });
    const courses = await model.Course.find({}, "id name options");
    const coursesName2Id = {};
    const coursesId2Name = {};
    await Promise.all(
      courses.map((course) => {
        coursesName2Id[course.name] = course.id;
        coursesId2Name[course.id] = course.name;
      })
    );
    const results = {};
    await Promise.all(
      resultData.map((result) => {
        if (!results[coursesName2Id[result.courseName]]) {
          results[coursesName2Id[result.courseName]] = [result.optionName];
        } else {
          results[coursesName2Id[result.courseName]] = [
            ...results[coursesName2Id[result.courseName]],
            result.optionName,
          ];
        }
      })
    );
    const preselects = {};
    await Promise.all(
      courses.map((course) => {
        const { options, id } = course;
        options.forEach((option) => {
          if (option.priority_type === "preselect") {
            if (option.priority_value.indexOf(userID) > -1) {
              preselects[id] = option.name;
            }
          }
        });
      })
    );
    const newSelectionData = JSON.parse(JSON.stringify(selectionData));
    const finalSelection = [];
    let preselect = "";
    for (let i = 0; i < newSelectionData.length; i++) {
      const data = selectionData[i];
      finalSelection.push(data);
      if (preselect !== "" && preselect !== data.courseID) {
        finalSelection.push({
          courseID: data.preselect,
          ranking: "preselect",
          name: preselects[preselect],
        });
        delete preselects[preselect];
        preselect = "";
      }
      if (Object.keys(preselects).indexOf(data.courseID) > -1) {
        preselect = data.courseID;
      }
    }
    if (preselect !== "") {
      finalSelection.push({
        courseID: preselect,
        ranking: "preselect",
        name: preselects[preselect],
      });
      delete preselects[preselect];
      preselect = "";
    }
    await Promise.all(
      Object.keys(preselects).map((key) => {
        finalSelection.push({
          courseID: key,
          ranking: "preselect",
          name: preselects[key],
        });
      })
    );
    if (!userData || !userID) {
      res.status(404).end();
    } else {
      res.send({
        userData,
        selectionData: finalSelection,
        results,
        coursesId2Name,
        preselects,
      });
    }
  })
);

router.delete(
  "/reset_selection",
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    await model.Selection.deleteMany();
    await model.Preselect.deleteMany();
    await model.Result.deleteMany();
    res.status(204).end();
  })
);

router.get(
  "/exportCourses.json",
  permissionRequired(constants.AUTHORITY_MAINTAINER),
  asyncHandler(async (req, res, next) => {
    const courses = await model.Course.find({}, {id: 1, name: 1, type: 1, description: 1, number: 1, options: 1, _id: 0}).exec();
    res.send(courses);
  })
);

router.post(
  "/importCourses",
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_MAINTAINER),
  asyncHandler(async (req, res, next) => {
    const courses = req.body;
    const new_courses = [];
    let pass;
    if (!courses || !Array.isArray(courses)) {
      res.status(400).end();
      return;
    }

    courses.forEach((data) => {
      if (
        typeof data.id === "string" &&
        typeof data.name === "string" &&
        typeof data.type === "string" &&
        typeof data.description === "string" &&
        typeof data.options === "object" &&
        typeof data.number === "number" &&
        constants.COURSE_TYPE.includes(data.type)
      ) {
        pass = true;
        data.options.forEach((option) => {
          if (
            typeof option.name !== "string" ||
            typeof option.limit !== "number" ||
            typeof option.priority_type !== "string" ||
            (typeof option.priority_value !== "number" &&
              typeof option.priority_value !== "object") ||
            !constants.PRIORITY_TYPE.includes(option.priority_type)
          ) {
            pass = false;
          }
        });
        if (pass) {
          new_courses.push(data);
        }
      }
    });
    const exist = await Promise.all(
      new_courses.map(async (data) => {
        const { id, name, type, description, options, number } =
          data;
        const course = await model.Course.findOne({ id }).exec();
        
        if (!course) {
          const courseDocument = new model.Course({
            id,
            name,
            type,
            description,
            options,
            number,
            students: [],
          });
          await courseDocument.save();
        }else{
          return id;
        }
      })
    );
    const duplicate = exist.filter((value, index, arr)=>{
      return value;
    })
    res.status(200).send(duplicate);
  })
);

module.exports = router;
