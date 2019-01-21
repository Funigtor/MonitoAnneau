const http = require('http'); //require serveur WEB
const url = require('url'); //pour les URL
const querystring = require('querystring');
const MongoClient = require("mongodb").MongoClient;
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
            selectInbDD();
          } else {
            console.error("[!] La collection default est vide");
            res.end();
          }
        });
    }
    function selectInbDD() {
      delete params.find;
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
  });
});
server.listen(8080);
