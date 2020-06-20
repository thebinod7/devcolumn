const amqp = require("amqplib/callback_api");
const CONN_URL = "amqp://localhost";
let ch = null;

amqp.connect(CONN_URL, function (err, conn) {
  conn.createChannel(function (err, channel) {
    ch = channel;
  });
});

const publishToQueue = async (queueName, data) => {
  ch.sendToQueue(queueName, new Buffer(data), { persistent: true });
  // Persistent used to persist data on server.
};

process.on("exit", (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});

module.exports = { publishToQueue };
