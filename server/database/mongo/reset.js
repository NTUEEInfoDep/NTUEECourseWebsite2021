// Reset all data in mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const model = require("./model");
const courses = require("../data/courses");

// Students with raw passwords, must be hashed later
const studentsRaw = require("../data/students.json");

// ========================================

module.exports = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("NODE_ENV = development");
    require("dotenv").config();
  }

  const SALT_ROUNDS = 10;
  const { MONGO_HOST, MONGO_DBNAME, MONGO_USERNAME, MONGO_PASSWORD} = process.env;

  mongoose.connect(`mongodb://${MONGO_USERNAME}:${ MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async () => {
    console.log("Successfully connect to MongoDB!");
    console.log(`dbName = "${MONGO_DBNAME}"`);

    // Drop the db
    await db.dropDatabase();
    console.log("Database has been cleared.");

    // Save all courses
    await Promise.all(
      courses.map(async (course) => {
        const courseDocument = new model.Course(course);
        await courseDocument.save();
      })
    );
    console.log("All courses are saved.");

    // Use bcrypt to hash all passwords
    console.log("Hashing the passwords of all students...");
    const students = [];
    await Promise.all(
      studentsRaw.map(async (studentRaw) => {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(studentRaw.password, salt);
        const student = { ...studentRaw };
        student.password = hash;
        student.userID = student.userID.toUpperCase();
        students.push(student);
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
    console.log("All students are saved.");

    // Save Start Time
    const startTimeDocument = new model.OpenTime({
      type: "start",
      time: Math.floor(new Date(2021, 0, 1, 0, 0) / 1000),
    });
    await startTimeDocument.save();
    console.log("Start time is saved.");

    // Save End Time
    const endTimeDocument = new model.OpenTime({
      type: "end",
      time: Math.floor(new Date(2026, 0, 1, 0, 0) / 1000),
    });
    await endTimeDocument.save();
    console.log("End time is saved.");

    // Disconnect
    await mongoose.disconnect();
  });
};
