const router = require("express").Router();
const amqp = require("amqplib/callback_api");
const nodemailer = require("nodemailer");
const { publishToQueue } = require("../services/RabbitMQ");

router.post("/msg", async (req, res, next) => {
  let { queueName, payload } = req.body;
  await publishToQueue(queueName, payload);
  res.statusCode = 200;
  res.data = { "message-sent": true };
  next();
});

const sendEmailTo = (recieverEmail) => {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    let mailOptions = {
      from: '"Rabbit MQ 👻" <binod@mailinator.com>',
      to: recieverEmail,
      subject: "Subscription ✔",
      text: "You are subscribed successfully.",
      html: "<b>You are subscribed successfully.</b>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
};

router.get("/", (req, res, next) => {
  const data = {
    title: "Devcolumn Exercise",
    message: "Welcome to million dollar app ;)",
  };
  res.render("index", data);
});

router.post("/subscribe", (req, res) => {
  sendToQueue(req.body);
  res.send("Thank you. You are successfully subscribed.");
});

const sendToQueue = (msg) => {
  amqp.connect("amqp://localhost", function (err, conn) {
    conn.createChannel(function (err, ch) {
      const q = "email";
      ch.assertQueue(q, { durable: true });
      ch.sendToQueue(q, new Buffer(JSON.stringify(msg)), { persistent: true });
      console.log("Message sent to queue : ", msg);
    });
  });
};

amqp.connect("amqp://localhost", function (err, conn) {
  conn.createChannel(function (err, ch) {
    const q = "email";
    ch.assertQueue(q, { durable: true });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(
      q,
      async function (msg) {
        console.log(" [x] Received %s", msg.content.toString());

        let form = JSON.parse(msg.content.toString());
        console.log("FOrm:", form);
        await sendEmailTo(form.email);
        ch.ack(msg);
      },
      { noAck: false }
    );
  });
});

module.exports = router;
