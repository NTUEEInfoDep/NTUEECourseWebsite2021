const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");

const apiRouter = require("./api");

// ========================================

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

const { MONGO_HOST, MONGO_DBNAME } = process.env;

// ========================================

mongoose.connect(`mongodb://${MONGO_HOST}/${MONGO_DBNAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Successfully connect to MongoDB!");
  console.log(`dbName = "${MONGO_DBNAME}"`);

  const app = express();

  if (process.env.NODE_ENV === "production") {
    console.log("Trust proxy is on");
    app.set("trust proxy", 1);
  }

  app.use(logger("dev"));
  app.use(express.static("build"));

  app.use("/api", apiRouter);

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
});
