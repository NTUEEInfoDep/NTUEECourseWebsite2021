// Update opentime

const redis = require("redis");

const constants = require("../../constants.json");
const openTime = require("../data/openTime.json");

// ========================================

function createDateString(spec) {
  const { year, month, day, hour, minutes } = spec;
  // month is 0 ~ 11, so we need to minus it by 1
  return new Date(year, month - 1, day, hour, minutes).toISOString();
}

module.exports = () => {
  const client = redis.createClient(6379, constants.redisHost);
  client.on("error", console.error);

  const { openTimeKey } = constants;
  const startTime = createDateString(openTime.start);
  const endTime = createDateString(openTime.end);

  client.hmset([openTimeKey, "start", startTime, "end", endTime], () => {
    console.log("openTime updated!");
  });

  client.quit();
};
