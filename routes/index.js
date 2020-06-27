const router = require("express").Router();
const Proxy = require("../utils/proxy");
router.use("/*", (req, res, next) => {
  //authentication?
  //billing
  //encode
  next();
});

router.post("/proxy/add", (req, res, next) => {
  console.log("Hello:");
  let test;
  Proxy(
    req,
    res,
    {
      url: `/api/v0/add?`,
      query: { pin: req.query.path, quiet: req.query.quiet },
      adapter: (body) => {
        //let hash = JSON.parse(body).Hash;
        Proxy(
          req,
          res,
          {
            url: `/api/v0/files/ls?`,
            query: { arg: req.query.arg, long: req.query.long },
          },
          (err, data) => {
            console.log("Data===", data);
            console.log("Errrrr===", err);
            if (err) Promise.reject(err);
            console.log(data);
          }
        );
      },
    },
    (err, data) => {
      console.log(data);
      if (err) {
        Promise.reject(err);
        return;
      }
    }
  );
  console.log(test, "+++++++");
});

router.get("/user/list", (req, res, next) => {
  Proxy(
    req,
    res,
    {
      url: `/api/v0/files/ls?`,
      query: { arg: req.query.arg, long: req.query.long },
    },
    (err, data) => {
      console.log("ERR:");
      if (err) Promise.reject(err);
      console.log("Data======", data);
    }
  );
});

router.post("/dir", (req, res, next) => {
  Proxy(
    req,
    res,
    {
      url: `/api/v0/files/mkdir?`,
      query: { arg: req.query.arg, long: req.query.long },
    },
    (err) => Promise.reject(err)
  );
});

router.delete("/", (req, res, next) => {
  Proxy(
    req,
    res,
    {
      url: `/api/v0/files/ls?`,
      query: { arg: req.query.arg, long: req.query.long },
    },
    (err, data) => {
      if (err) {
        Promise.reject(err);
        return;
      }
    }
  );
});

router.get("/", (req, res, next) => {
  const data = {
    title: "Devcolumn Exercise",
    message: "Welcome to million dollar app ;)",
  };
  res.render("index", data);
});

module.exports = router;
