const router = require("express").Router();

const NotifyController = require("../controllers/notification.controller");

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

router.post("/mark-read/:notify_id", async (req, res, next) => {
    NotifyController.markAsRead(req.params.notify_id, req.body.userId)
        .then(d => {
            let wss = req.wss;
            // wss.on("connection", function connection(ws) {
            //     ws.on("message", function incoming(query) {
            //         wss.clients.forEach(function each(socket) {
            //             let socket_state = socket.readyState;
            //             NotifyController.list(123)
            //                 .then(result => {
            //                     if (socket_state === 1) {
            //                         socket.send(JSON.stringify(result));
            //                     }
            //                 })
            //                 .catch(err => {
            //                     throw err;
            //                 });
            //         });
            //     });
            // });
            res.json(d);
        })
        .catch(e => next(e));
});

router.get("/listall", (req, res, next) => {
    NotifyController.list()
        .then(d => res.json(d))
        .catch(e => next(e));
});

router.get("/demo/", (req, res) => {
    res.render("demo2");
});

router.get("/notify/", (req, res) => {
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
    res.render("demo");
});

module.exports = router;
