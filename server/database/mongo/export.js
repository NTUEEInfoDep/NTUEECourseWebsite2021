// Export student selections.

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const model = require("./model");

// ========================================

const { MONGO_HOST, MONGO_DBNAME } = process.env;

module.exports = (outputFile) => {
  const outputPath = path.resolve(__dirname, "../private-data", outputFile);
  mongoose.connect(`mongodb://${MONGO_HOST}/${MONGO_DBNAME}`, {
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
    fs.writeFileSync(outputPath, JSON.stringify(students));
    console.log("Student selections export finished!");

    // Disconnect
    await mongoose.disconnect();
  });
};
