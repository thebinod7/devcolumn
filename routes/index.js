const router = require("express").Router();

router.get("/", (req, res, next) => {
    const data = {
        title: "Devcolumn Exercise",
        message: "Welcome to million dollar app ;)"
    };
    res.render("index", data);
});

router.get("/notify/", (req, res, next) => {
    let wss = req.wss;
    wss.on("connection", function connection(ws) {
        ws.on("message", function incoming(data) {
            wss.clients.forEach(function each(client) {
                client.send(data);
            });
        });
    });
    res.render("demo");
});

module.exports = router;
