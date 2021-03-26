// Update opentime

const redis = require("redis");

const openTime = require("../data/openTime.json");

// ========================================

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  require("dotenv").config(); // eslint-disable-line
}

const { REDIS_HOST, REDIS_PORT } = process.env;
const OPEN_TIME_KEY = "ntuee-course-opentime";

// ========================================

function createDateString(spec) {
  const { year, month, day, hour, minutes } = spec;
  // month is 0 ~ 11, so we need to minus it by 1
  return new Date(year, month - 1, day, hour, minutes).toISOString();
}

module.exports = () => {
  const client = redis.createClient(REDIS_PORT, REDIS_HOST);
  client.on("error", console.error);

  const startTime = createDateString(openTime.start);
  const endTime = createDateString(openTime.end);

  client.hmset([OPEN_TIME_KEY, "start", startTime, "end", endTime], () => {
    console.log("openTime updated!");
  });

  client.quit();
};
