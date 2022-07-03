// Reset all data in mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const model = require("./model");

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

    model.Selection.deleteMany()
    model.Preselect.deleteMany()
    model.Result.deleteMany()

    // Disconnect
    await mongoose.disconnect();
  });
};
