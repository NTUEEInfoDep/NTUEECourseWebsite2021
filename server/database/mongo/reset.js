// Reset all data in mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const constants = require("../../constants");
const model = require("./model");
const courses = require("../data/courses");

// Students with raw passwords, must be hashed later
const studentsRaw = require("../private-data/students.json");

// ========================================

module.exports = () => {
  mongoose.connect(`mongodb://${constants.mongoHost}/${constants.dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async () => {
    console.log("Successfully connect to MongoDB!");
    console.log(`dbName = "${constants.dbName}"`);

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
        const salt = await bcrypt.genSalt(constants.saltRounds);
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

    // Disconnect
    await mongoose.disconnect();
  });
};
