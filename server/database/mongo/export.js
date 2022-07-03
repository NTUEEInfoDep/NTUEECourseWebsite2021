// Export student selections.

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const model = require("./model");

// ========================================

module.exports = (outputFile) => {
  if (process.env.NODE_ENV === "development") {
    console.log("NODE_ENV = development");
    require("dotenv").config();
  }
  const { MONGO_HOST, MONGO_DBNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env;
  const selectionsOutputPath = path.resolve(
    __dirname,
    "../private-data/selections.json"
  );
  const coursesOutputPath = path.resolve(
    __dirname,
    "../private-data/courses.json"
  );
  const studentsOutputPath = path.resolve(
    __dirname,
    "../private-data/students.json"
  );
  const preSelectionsOutputPath = path.resolve(
    __dirname,
    "../private-data/preselections.json"
  );

  mongoose.connect(`mongodb://${MONGO_USERNAME}:${ MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async () => {
    console.log("Successfully connect to MongoDB!");
    console.log(`dbName = "${MONGO_DBNAME}"`);

    // Export
    const students = await model.Student.find(
      {},
      { _id: 0, __v: 0, password: 0 }
    ).exec();
    fs.writeFileSync(studentsOutputPath, JSON.stringify(students));
    console.log("Student export finished!");

    const courses = await model.Course.find({}, { _id: 0, __v: 0 }).exec();
    fs.writeFileSync(coursesOutputPath, JSON.stringify(courses));
    console.log("Course export finished!");

    const selections = await model.Selection.find(
      {},
      { _id: 0, __v: 0 }
    ).exec();
    fs.writeFileSync(selectionsOutputPath, JSON.stringify(selections));
    console.log("Selections export finished!");

    const preSelections = await model.Preselect.find(
      {},
      { _id: 0, __v: 0 }
    ).exec();
    fs.writeFileSync(preSelectionsOutputPath, JSON.stringify(preSelections));
    console.log("PreSelections export finished!");

    // Disconnect
    await mongoose.disconnect();
  });
};
