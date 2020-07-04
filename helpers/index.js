const Twitter = require("twitter");
const CronJob = require("cron").CronJob;

const twitterFeed = async () => {
  let twitter_config = {
    consumer_key: "YOUR_CONSUMER_KEY",
    consumer_secret: "YOUR_CONSUMER_SECRET_KEY",
    access_token_key: "YOUR_ACCESS_TOKEN_KEY",
    access_token_secret: "YOUR_ACCESS_TOKEN_SECRET",
  };
  try {
    let client = new Twitter(twitter_config);
    let status = "Hello worldy! https://www.example.com";
    let d = await client.post("statuses/update", {
      status,
    });
    return d;
  } catch (e) {
    console.log("ERR===", e);
    return e;
  }
};

const schedular = () => {
  let job = new CronJob(
    "0 */5 * * * *",
    //Run this job after every 5 minutes.
    async () => {
      await twitterFeed();
    },
    null,
    true,
    "Asia/Kathmandu"
    // Your timezone
  );
  job.start();
};

module.exports = { schedular };
