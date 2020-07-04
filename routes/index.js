const router = require("express").Router();
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message: "Too many requests. Pleas try again in 15 minutes.",
});

const csrfProtection = csrf({ cookie: true });

router.get("/test-limit", limiter, (req, res, next) => {
  res.json({ msg: "Limit test" });
});

router.get("/", (req, res, next) => {
  const data = {
    title: "Devcolumn Exercise",
    message: "Welcome to million dollar app ;)",
  };
  res.render("index", data);
});

router.get("/form", csrfProtection, function (req, res) {
  console.log("REQ:", req.csrfToken());
  // pass the csrfToken to the view
  res.render("submitForm", { csrfToken: req.csrfToken() });
});

router.post("/process", csrfProtection, function (req, res) {
  res.send("CSRF Token passed.");
});

module.exports = router;
