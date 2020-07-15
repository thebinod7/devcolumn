const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const WebSocket = require("ws");
const http = require("http");

const RouteManager = require("./routes");
const config = require("config");

//mongoose.Promise = global.Promise;
mongoose.connect(config.get("app.db"));

mongoose.connection.on("connected", function() {
    console.log("Connected to database successfully.");
});

mongoose.connection.on("error", function(err) {
    console.log("Database error:" + " " + err);
});

const port = Number(process.env.PORT || 6969);
const app = express();

const wss = new WebSocket.Server({ server: app.listen(port) });

// wss.on("connection", socket => {
//     socket.on("message", message => {
//         console.log(`received from a client: ${message}`);
//     });
//     socket.send("Hello worldy!");
// });

app.use(function(req, res, next) {
    req.wss = wss;
    return next();
});

app.use(morgan("combined"));
app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Add headers
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,authorization"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// ROUTES FOR OUR API
app.use("/", RouteManager);
app.use(express.static(path.join(__dirname, "public")));

//Start server
// app.listen(port, function() {
//     console.log("Server running at port:" + port);
// });
