const router = require("express").Router();
const NotifyController = require("../controllers/notification.controller");

router.get("/", (req, res, next) => {
    const data = {
        title: "Devcolumn Exercise",
        message: "Welcome to million dollar app ;)"
    };
    res.render("index", data);
});

// router.get("/notify/", (req, res, next) => {
//     let wss = req.wss;
//     wss.on("connection", function connection(ws) {
//         ws.on("message", function incoming(data) {
//             wss.clients.forEach(function each(client) {
//                 client.send(data);
//             });
//         });
//     });
//     res.render("demo");
// });

router.post("/notify", (req, res, next) => {
    NotifyController.add(req.body)
        .then(d => res.json(d))
        .catch(e => next(e));
});

router.get("/notify", (req, res, next) => {
    let wss = req.wss;
    wss.on("connection", function connection(ws) {
        ws.on("message", function incoming(data) {
            console.log("DATA==", data);
            wss.clients.forEach(function each(client) {
                NotifyController.list().then(d => {
                    client.send(JSON.stringify(d));
                });
            });
        });
    });
    res.render("demo");
});

module.exports = router;
