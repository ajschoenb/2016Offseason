var mysql = require("mysql");
var rest = require("./REST.js");
var md5 = require("MD5");
var express = require("express");
var bodyParser = require("body-parser");
app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

function REST() {
  var self;
  self = this;
  self.connectMysql();
}

REST.prototype.connectMysql = function() {
  var self = this;
  var pool = mysql.createPool({
    connectionLimit: 100,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "frcscout2016",
    debug: false
  });
  pool.getConnection(function(err, connection) {
    if (err)
      self.stop(err);
    else
      self.configureExpress(connection);
  });
};

REST.prototype.configureExpress = function(connection) {
  var self = this;
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  router = express.Router();
  app.use("/", router);
  var rest_router = new rest(router, connection, md5);
  self.startServer();
};

REST.prototype.startServer = function() {
  var port = Number(process.env.PORT || 8080);
  app.listen(port, (function() {
    console.log("FRC Scout servers running on port 8080");
  }));
};

REST.prototype.stop = function(err) {
  console.log("MYSQL ERROR THROWN: \n" + err);
  process.exit(1);
};

new REST;
