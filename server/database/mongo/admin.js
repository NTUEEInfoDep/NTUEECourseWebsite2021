// Reset all data in mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const model = require("./model");

// Students with raw passwords, must be hashed later
const studentsRaw = [
  {
    userID: "b00000000",
    grade: 2,
    name: "A",
    authority: 2,
  },
];

// ========================================

module.exports = (password) => {
  if (process.env.NODE_ENV === "development") {
    console.log("NODE_ENV = development");
    require("dotenv").config();
  }

  const SALT_ROUNDS = 10;
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

    // Check if using default password
    if (password === "admin") {
      console.log(`Using default password admin! You can specufy your own.`);
    }

    // Use bcrypt to hash all passwords
    const admin = await model.Student.findOne({ userID: "B00000000" }).exec();
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    console.log("Hashing the password...");

    // Update or Add admin data to mongodb
    if (admin === null) {
      const newAdmin = new model.Student({
        userID: "B00000000",
        grade: 2,
        password: hash,
        name: "Admin",
        authority: 2,
      });
      await newAdmin.save();
      console.log();
    } else {
      admin.password = hash;
      await admin.save();
    }

    console.log("Admin password is hashed!");

    // Disconnect
    await mongoose.disconnect();
  });
};
