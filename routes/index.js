const router = require("express").Router();
const NotifyController = require("../controllers/notification.controller");

const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("connect", function() {
    console.log("You are now connected to redis");
});

redisClient.on("error", function(err) {
    console.log("Something went wrong " + err);
});

router.get("/", (req, res, next) => {
    const data = {
        title: "Devcolumn Exercise",
        message: "Welcome to million dollar app ;)"
    };
    res.render("index", data);
});

router.post("/notify", async (req, res, next) => {
    NotifyController.add(req.body)
        .then(d => {
            NotifyController.list().then(result => {
                redisClient.set("notifications", JSON.stringify(result));
                res.json(d);
            });
        })
        .catch(e => next(e));
});

router.get("/listall", (req, res, next) => {
    NotifyController.list()
        .then(d => res.json(d))
        .catch(e => next(e));
});

router.get("/notify/:userId", (req, res, next) => {
    let wss = req.wss;
    wss.on("connection", function connection(ws) {
        ws.on("message", function incoming(data) {
            wss.clients.forEach(function each(client) {
                redisClient.get("notifications", function(error, result) {
                    if (error) throw error;
                    let jsonData = JSON.parse(result);
                    let _filter = getById(data, jsonData);
                    console.log("Filter===", _filter);
                    client.send(JSON.stringify(_filter));
                });
            });
        });
    });
    res.render("demo");
});

const getById = (userId, data) => {
    let res = data.filter(function(d) {
        return d.notifiers.userId === userId;
    });
    return res;
};

module.exports = router;
