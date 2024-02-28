const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  checkLogin(username, password).then((result) => {
    if (result) {
      res.json(result.json());
    } else {
      res.status(401); //401 è il codice http Unauthorized)
      res.json({ result: "Unauthorized" });
    }
  });
});

//http
const server = http.createServer(app);
server.listen(80, () => {
  console.log("- server running");
});
