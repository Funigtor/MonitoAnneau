var http = require('http'); //require serveur WEB
var url = require('url'); //pour les URL
var querystring = require('querystring');
var MongoClient = require("mongodb").MongoClient;
var MongoObjectID = require("mongodb").ObjectID;
const fs = require('fs');
const displayFile = fs.readFileSync("display.html");

var server = http.createServer(function (req, res) {

  var params = querystring.parse(url.parse(req.url).query);
  var result = "";
  var devices = undefined;
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });
  console.log("[+] connection to Monitoanneau.")
  MongoClient.connect("mongodb://localhost", function (error, client) {
    if (error) throw error;
    console.log("[+] connected to Monitoanneau");
    var db = client.db("monnit'home");
    selectOption();
    return;

    function selectOption() {
      if ('insert' in params) {
        insertInBDD();
      }
      if ('find' in params) {
        findInBDD();
      }
      if ('chart' in params) {
        sendChart();
      }
      if ('erase' in params) {
        eraseInBDD();
      }
    }

    function findInBDD() {
        db.collection("default").find().toArray(function (error, results) {
          if (error) throw error;
          if (results.length != 0) {
            devices = results;
            console.log("collections " + results.length);
            selectInbDD();
          } else {
            console.log("[!] La collection est vide.");
            res.end();
          }
        });
    }
    if ('find' in params) {
      findInBDD();
    }
    if ('erase' in params) {
      eraseInBDD();
    }
    function findInBDD() {
        db.collection("default").find().toArray(function (error, results) {
          if (error) throw error;
          if (results.length != 0) {
            devices = results;
            selectInbDD();
          } else {
            console.error("[!] La collection default est vide");
            res.end();
          }
        });
    }
    function selectInbDD() {
      var tmp = params;
      delete tmp.find;
      for (key in params) {
        var tab = new Array();
        devices.forEach(function (elmnt, index) {
          if (elmnt[key] === params[key]) tab.push(elmnt);
        });
        devices = tab;
      }
      res.write(JSON.stringify(devices));
      res.end();
    }
    function sendChart() {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(displayFile, function () {
        res.end();
      })
    }
    function insertInBDD(newObj) {
      var tmp = params;
      delete tmp.insert;
      db.collection("default").insert(params, null, function (error, results) {
        if (error) throw error;
        console.log("[+] Document inséré")
      });
      res.end();
      return
    }
    function eraseInBDD() {
        if ('id' in params) {
          db.collection("default").deleteOne({
            _id: new require("mongodb").ObjectID(params['id'])
          }, function (err, results) {
            if (err) {
              console.log("[!] failed");
              throw err;
            }
            console.log("[+] success");
          });
          res.end()
        }
    }
    res.end();
  });
});
server.listen(8080);
