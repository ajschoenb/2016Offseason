const electron = require("electron").app;
const {BrowserWindow} = require("electron");
var mysql = require("mysql");
var rest = require("./rest.js");
var express = require("express");
var bodyParser = require("body-parser");
app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

let win;

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
    password: "root",
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
  var rest_router = new rest(router, connection);
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

// Actually start the window
electron.on("ready", function() {
  win = new BrowserWindow({
    height: 10000,
    width: 10000,
    icon: __dirname + "/118.png"
  });
  win.loadURL("http://localhost:8080"); // Load homepage
});
