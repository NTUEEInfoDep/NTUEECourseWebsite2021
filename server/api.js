const uuid = require("node-uuid");
const { promisify } = require("util");

const express = require("express");
const session = require("express-session");
const asyncHandler = require("express-async-handler");
const redis = require("redis");
const connectRedis = require("connect-redis");
const bcrypt = require("bcrypt");
const debug = require("debug")("ntuee-course:api");
const deprecate = require("depd")("ntuee-course:api");
const mongoose = require("mongoose");

const model = require("./database/mongo/model");
const constants = require("./constants");

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
  const startTime = await model.OpenTime.findOne({ type: "start" }).exec();
  const endTime = await model.OpenTime.findOne({ type: "end" }).exec();
  const now = Math.floor(new Date() / 1000);
  if (
    (now < startTime.time || now > endTime.time) &&
    req.session.authority !== "Admin" &&
    req.session.authority !== "Maintainer"
  ) {
    res.status(503).send({ start: startTime.time, end: endTime.time });
    return;
  }
  next();
});

const permissionRequired = (permission) =>
  asyncHandler(async (req, res, next) => {
    if (req.session.authority < permission) {
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
    asyncHandler(async (req, res, next) => {
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
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
    const start = req.body.start;
    const end = req.body.end;
    if (parseInt(start) != start || parseInt(end) != end) {
      res.status(400).end();
      return;
    }

    await model.OpenTime.updateOne(
      { type: "start" },
      { time: parseInt(start) }
    );
    await model.OpenTime.updateOne({ type: "end" }, { time: parseInt(end) });
    res.status(204).end();
  })
);

router.use(openTimeMiddleware).get(
  "/courses",
  asyncHandler(async (req, res, next) => {
    if (!req.session.userID) {
      res.status(403).end();
      return;
    }
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
  asyncHandler(async (req, res, next) => {
    const modifiedData = req.body;
    const { authority } = req.session;
    mongoose.set("useFindAndModify", false);

    permissionRequired(constants.AUTHORITY_ADMIN);

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
    asyncHandler(async (req, res, next) => {
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
      permissionRequired(constants.AUTHORITY_MAINTAINER);
      const studentGroup = await model.Student.find({}).exec();
      const filtered = [];
      let items;
      // deal with query no query and one query key(foreach only for array)
      if (!req.query.keys) {
        items = [];
      } else if (typeof req.query.keys === "string") {
        items = [];
        items.push(req.query.keys);
      } else {
        items = req.query.keys;
      }
      studentGroup.forEach((student) => {
        const filteredstudent = {};
        filteredstudent.id = student.userID;
        items.forEach((item) => {
          filteredstudent[item] = student[item];
        });
        filtered.push(filteredstudent);
      });
      res.send(filtered);
    })
  )
  .post();

router
  .route("/selections/:courseID")
  .all(openTimeMiddleware)
  .all(
    asyncHandler(async (req, res, next) => {
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
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
    asyncHandler(async (req, res, next) => {
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
      permissionRequired(constants.AUTHORITY_MAINTAINER);
      const addData = req.body;

      await Promise.all(
        addData.map(async (data) => {
          const id = data.id;
          const name = data.name;
          const type = data.type;
          const description = data.description;
          const options = data.options;
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
    asyncHandler(async (req, res, next) => {
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
      permissionRequired(constants.AUTHORITY_MAINTAINER);
      const deleteData = req.body;
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
    express.urlencoded({ extended: false }),
    asyncHandler(async (req, res, next) => {
      if (!req.session.userID) {
        res.status(403).end();
        return;
      }
      permissionRequired(constants.AUTHORITY_MAINTAINER);
      const { id } = req.body;
      const { name } = req.body;
      const { type } = req.body;
      const { description } = req.body;
      const { options } = req.body;
      const course = await model.Course.findOne({ id }).exec();
      if (!course) {
        res.status(404).end();
        return;
      }
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
      res.status(204).end();
    })
  );

router.route("/authority").put(
  express.urlencoded({ extended: false }),
  asyncHandler(async (req, res, next) => {
    permissionRequired(constants.AUTHORITY_ADMIN);
    let { userID } = req.body;
    const { authority } = req.body;
    userID = userID.toUpperCase();
    const user = await model.Student.findOne({ userID }).exec();
    if (!user) {
      res.status(404).end();
      return;
    }
    await model.Student.updateOne({ userID }, { authority });
    res.status(204).end();
  })
);

module.exports = router;
