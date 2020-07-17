const router = require("express").Router();
const NotifyController = require("../controllers/notification.controller");

// TODO server side data emit.

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
            let wss = req.wss;
            wss.on("connection", function connection(ws) {
                ws.on("message", function incoming(query) {
                    wss.clients.forEach(function each(socket) {
                        let socket_state = socket.readyState;
                        NotifyController.list(123)
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
            res.json(d);
        })
        .catch(e => next(e));
});

router.post("/notify/:id", async (req, res, next) => {
    NotifyController.updateRead(req.params.id, req.body.userId)
        .then(d => {
            let wss = req.wss;
            wss.on("connection", function connection(ws) {
                ws.on("message", function incoming(query) {
                    wss.clients.forEach(function each(socket) {
                        let socket_state = socket.readyState;
                        NotifyController.list(123)
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
            console.log("update:", d);
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
        ws.on("message", function incoming(query) {
            console.log("QUERY:", query);
            wss.clients.forEach(function each(socket) {
                let socket_state = socket.readyState;
                NotifyController.list(123)
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
