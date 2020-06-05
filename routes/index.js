const router = require("express").Router();
const { lookup } = require("geoip-lite");

router.get("/", (req, res, next) => {
  const ip =
    req.ip || req.header("x-forwarded-for") || req.connection.remoteAddress;
  const _lookup = lookup(ip);
  res.send({ ip_details: _lookup });
});

module.exports = router;
