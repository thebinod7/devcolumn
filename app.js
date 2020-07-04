const express = require("express");

const { schedular } = require("./helpers/");

const app = express();

schedular();

const port = Number(8888);

//Start server at given port number.
app.listen(port, function () {
  console.log("Server running at port:" + port);
});
