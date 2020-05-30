const router = require("express").Router();

router.get("/", (req, res, next) => {
  const data = {
    title: "Devcolumn Exercise",
    message: "Welcome to million dollar app ;)",
  };
  res.render("index", data);
});

module.exports = router;
