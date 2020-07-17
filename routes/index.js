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
            res.json(d);
        })
        .catch(e => next(e));
});

router.get("/listall", (req, res, next) => {
    NotifyController.list()
        .then(d => res.json(d))
        .catch(e => next(e));
});

router.get("/notify/", (req, res, next) => {
    let wss = req.wss;
    wss.on("connection", function connection(ws) {
        ws.on("message", function incoming(data) {
            wss.clients.forEach(function each(socket) {
                let socket_state = socket.readyState;
                NotifyController.list({ user: data })
                    .then(result => {
                        if (socket_state === 1) {
                            socket.send(JSON.stringify(result));
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            });
        });
    });
    res.render("demo");
});

const listyById = () => {};

const getById = (userId, data) => {
    let res = data.filter(function(d) {
        return d.notifiers.userId === userId;
    });
    return res;
};

module.exports = router;
