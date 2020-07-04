const router = require("express").Router();
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

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
