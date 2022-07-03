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

  const { MONGO_HOST, MONGO_DBNAME, MONGO_USERNAME, MONGO_PASSWORD } = process.env;

  mongoose.connect(`mongodb://${MONGO_USERNAME}:${ MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", async () => {
    console.log("Successfully connect to MongoDB!");
    console.log(`dbName = "${MONGO_DBNAME}"`);

    // Clean selections
    await model.Selection.deleteMany({});
    console.log("Clean all selections!!!");

    await model.Preselect.deleteMany({});
    console.log("Clean all preselect!!!");

    // Disconnect
    await mongoose.disconnect();
  });
};
