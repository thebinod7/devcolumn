const router = require("express").Router();
const mailer = require("../utils/mailer");

router.get("/", (req, res, next) => {
  const data = {
    title: "Devcolumn Exercise",
    message: "Welcome to million dollar app ;)",
  };
  res.render("index", data);
});

router.get("/send-email", async (req, res, next) => {
  const options = {
    action: "demo",
    subject: "Test mail.",
    sendTo: "john@mailinator.com", //Recipient email address.
    data: { name: "John Doe", message: "This is a test message." },
  };
  try {
    await mailer.send(options);
    res.send({ success: true, message: "Email sent successfully." });
  } catch (e) {
    alert("Email sending failed.");
  }
});

module.exports = router;
