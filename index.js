var http = require('http'); //require serveur WEB
var url = require('url'); //pour les URL
var querystring = require('querystring');
var MongoClient = require("mongodb").MongoClient;
const fs = require('fs');
fs.writeFileSync("/tmp/pidMonito", process.pid);
const displayFile = fs.readFileSync("display.html");

var server = http.createServer(function(req, res) {

  var params = querystring.parse(url.parse(req.url).query);
  var result = "";
  var devices = undefined;
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
      if (error) throw error;
      console.log("connected to Monitoanneau");
      var db = client.db('monitoanneau');
      selectOption();
      return;
      function selectOption() {
        console.log("params" + JSON.stringify(params));
        if ('insert' in params) {
          console.log("insert");
          insertInBDD();
        }
        if ('find' in params) {
          console.log("find");
          findInBDD();
        }
        if ('chart' in params) {
          sendChart();
        }
      }
      function findInBDD() {
        if ('collection' in params) {
          db.collection(params['collection']).find().toArray(function(error, results) {
            if (error) throw error;
            if (results.length != 0) {
              devices = results;
              console.log("coollections " + results.length);
              selectInbDD();
            } else {
              console.error("collection " + params['piece'] + " not found.");
            }
          });
        } else {
          console.error("pas de nom de coollection...");
          res.end();
        }
          
      }
      function selectInbDD() {
        var tmp = params;
        delete tmp.find;
        delete tmp.collection;
        for (key in params) {
          console.log(key);
          var tab = new Array();
          devices.forEach(function(elmnt, index) {
            if (elmnt[key] === params[key]) tab.push(elmnt);
          });
          devices = tab;
        }

        res.write(JSON.stringify(devices));
        res.end();
      }

      function insertInBDD(newObj) {
        var tmp = params;
        delete tmp.insert;
        console.log(JSON.stringify(params));
        db.collection(params['collection']).insert(params, null, function(error, results) {
          if (error) throw error;
          console.log("Document inséré")
        });
        res.end();
        return
      }

      function sendChart(){
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(displayFile,function(){
          res.end();
        })
      }
  });
});
server.listen(8080);
