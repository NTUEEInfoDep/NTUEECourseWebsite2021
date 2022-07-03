const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const cron = require("node-cron");

const swaggerUi = require("swagger-ui-express");
const apiRouter = require("./api");
const swaggerDocs = require("./swagger.json");
const model = require("./database/mongo/model");
const constants = require("./constants");
// ========================================

// ========================================

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

// ========================================

const db = model.conn;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Successfully connect to MongoDB!");
  console.log(`dbName = "${process.env.MONGO_DBNAME}"`);

  cron.schedule("59 */1 * * *", async () => {
    try {
      const startTime = await model.OpenTime.findOne({
        type: constants.START_TIME_KEY,
      }).exec();
      const endTime = await model.OpenTime.findOne({
        type: constants.END_TIME_KEY,
      }).exec();
      const now = Math.floor(new Date() / 1000);
      if (now >= startTime.time && now <= endTime.time) {
        console.log("Executing backup...");
	const mongo_url = process.env.MONGO_URL + now + "?retryWrites=true&w=majority";
	const conn_atlas = mongoose.createConnection(mongo_url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        constants.MODEL.map(async (modelData) => {
	  const schema = model[modelData[1]];
	  const atlas = conn_atlas.model(modelData[0], schema);
          const allData = await model[modelData[0]].find({});
          await Promise.all(
            allData.map(async (RawData) => {
              const data = {};
              await modelData[2].map((key) => {
                data[key] = RawData[key];
              });
              const document = atlas(data);
              await document.save();
            })
          );
          console.log(`All data in ${modelData[0]} is backuped.`);
        });
      }
    } catch (e) {
      console.log("Back up failed");
    }
  });

  const app = express();

  if (process.env.NODE_ENV === "production") {
    console.log("Trust proxy is on");
    app.set("trust proxy", 1);
  }

  app.use(logger("dev"));
  app.use(express.static("build"));

  app.use("/api", apiRouter);
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
});
