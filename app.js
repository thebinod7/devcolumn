const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const RouteManager = require("./routes");
const config = require("config");

// Connect to database using mongoose.
mongoose.connect(config.get("app.db_url"));
mongoose.connection.on("connected", function () {
  console.log("Connected to database successfully.");
});

mongoose.connection.on("error", function (err) {
  console.log("Database error:" + " " + err);
});

const app = express();

// To log requests inside app.
app.use(morgan("combined"));

const port = Number(config.get("app.port") || 8888);

// view engine setup to ejs.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// To parse data from form body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ROUTES FOR OUR APP
app.use("/", RouteManager);

// To serve static files inside public folder. eg: js, css, images.
app.use(express.static(path.join(__dirname, "public")));

//Start server at given port number.
app.listen(port, function () {
  console.log("Server running at port:" + port);
});
