const uuid = require("node-uuid");

const express = require("express");
const session = require("express-session");
const asyncHandler = require("express-async-handler");
const redis = require("redis");
const connectRedis = require("connect-redis");
const bcrypt = require("bcrypt");
const deprecate = require("depd")("ntuee-course:api");
const mongoose = require("mongoose");

const constants = require("./constants");
const model = require("./database/mongo/model");

// ========================================

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

const { REDIS_HOST, REDIS_PORT } = process.env;

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

router.route("/opentime").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const { start } = req.body;
    const { end } = req.body;
    if (typeof start !== "number" || typeof end !== "number") {
      res.status(400).end();
      return;
    }
    if (start > 0 || end > 0) {
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
    let items;
    // deal with query no query and one query key(foreach only for array)
    if (!req.query.keys) {
      items = [];
    } else if (typeof req.query.keys === "string") {
      items = [req.query.keys];
    } else {
      items = req.query.keys;
    }

    coursesGroup.forEach((course) => {
      const filteredcourse = {};
      filteredcourse.id = course.id;
      items.forEach((item) => {
        filteredcourse[item] = course[item];
      });
      filtered.push(filteredcourse);
    });
    /*
    const coursesGroup = await model.Course.aggregate([
      {
        $group: {
          _id: "$type",
          courses: { $push: { courseID: "$id", name: "$name" } },
        },
      },
    ]);

    const data = [];
    coursesGroup.forEach((group) => {
      /* eslint-disable-next-line no-underscore-dangle
      data.push(group.courses);
    });
    */
    res.send(filtered);
  })
);

router.route("/password").put(
  express.json({ strict: false }),
  permissionRequired(constants.AUTHORITY_ADMIN),
  asyncHandler(async (req, res, next) => {
    const modifiedData = req.body;
    mongoose.set("useFindAndModify", false);

    if (!modifiedData || !Array.isArray(modifiedData)) {
      res.status(400).end();
      return;
    }
    await Promise.all(
      modifiedData.map(async (data) => {
        const SALT_ROUNDS = 10;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(data.new_password, salt);
        const filter = { userID: data.userID };
        const update = { password: hash };
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
      let items;
      // deal with query no query and one query key(foreach only for array)
      if (!req.query.keys) {
        items = [];
      } else if (typeof req.query.keys === "string") {
        items = [req.query.keys];
      } else {
        items = req.query.keys;
      }
      studentGroup.forEach((student) => {
        const filteredstudent = {};
        filteredstudent.id = student.userID;
        items.forEach((item) => {
          if (item === "password") {
            res.status(403).end();
            return;
          }
          filteredstudent[item] = student[item];
        });
        filtered.push(filteredstudent);
      });
      res.send(filtered);
    })
  )
  .post(
    express.json({ extended: false }),
    permissionRequired(constants.AUTHORITY_MAINTAINER),
    asyncHandler(async (req, res, next) => {
      const studentsRaw = req.body;
      const students = [];
      let cnt = 0;

      if (!studentsRaw || !Array.isArray(studentsRaw)) {
        res.status(400).end();
        return;
      }
      studentsRaw.forEach((studentRaw) => {
        if (
          !studentRaw.userID ||
          !studentRaw.grade ||
          !studentRaw.password ||
          !studentRaw.name ||
          !studentRaw.authority
        ) {
          res.status(400).end();
          return;
        }
        if (
          typeof studentRaw.authority !== "number" &&
          typeof grade !== "number"
        ) {
          res.status(400).end();
        }
      });
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
    permissionRequired(constants.AUTHORITY_MAINTAINER),
    asyncHandler(async (req, res, next) => {
      const deleteData = req.body;

      if (!deleteData || !Array.isArray(deleteData)) {
        res.status(400).end();
        return;
      }
      await Promise.all(
        deleteData.map(async (userID) => {
          const student = await model.Student.findOne({ userID }).exec();
          if (student) {
            await model.Student.deleteOne({ userID });
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
        "name type description options"
      );
      if (!course) {
        res.sendStatus(404);
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
      const { name, type, description, options } = req.course;
      const user = await model.Student.findOne({ userID }, "selections");
      const { selections } = user;
      const selected = selections[courseID];
      const unselected = options.filter((option) => !selected.includes(option));
      res.send({ name, type, description, selected, unselected });
    })
  )
  .put(
    express.json({ strict: false }),
    asyncHandler(async (req, res, next) => {
      const { userID } = req.session;
      const { courseID } = req.params;
      const { options } = req.course;

      // Validation
      if (!Array.isArray(req.body)) {
        res.status(400).end();
        return;
      }
      if (!req.body.every((option) => options.includes(option))) {
        res.status(400).end();
        return;
      }

      const update = {};
      update[`selections.${courseID}`] = req.body;
      const result = await model.Student.updateOne({ userID }, update);
      res.status(204).end();
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
      if (!addData || !Array.isArray(addData)) {
        res.status(400).end();
        return;
      }
      await Promise.all(
        addData.map(async (data) => {
          const { id } = data;
          const { name } = data;
          const { type } = data;
          const { description } = data;
          const { options } = data;
          const course = await model.Course.findOne({ id }).exec();
          if (course) {
            await model.Course.deleteOne({ id }).exec();
          }
          const courseDocument = new model.Course({
            id,
            name,
            type,
            description,
            options,
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
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
      const deleteData = req.body;
      if (!deleteData || !Array.isArray(deleteData)) {
        res.status(400).end();
        return;
      }
      await Promise.all(
        deleteData.map(async (id) => {
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
      if (!modifiedData || !Array.isArray(modifiedData)) {
        res.status(400).end();
        return;
      }
      await Promise.all(
        modifiedData.map(async (data) => {
          const { id } = data;
          const { name } = data;
          const { type } = data;
          const { description } = data;
          const { options } = data;
          const course = await model.Course.findOne({ id }).exec();
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
    if (!modifiedData || !Array.isArray(modifiedData)) {
      res.status(400).end();
      return;
    }
    await Promise.all(
      modifiedData.map(async (data) => {
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

module.exports = router;
