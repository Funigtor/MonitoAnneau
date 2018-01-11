var http = require('http'); //require serveur WEB
var url = require('url'); //pour les URL
var querystring = require('querystring');
var MongoClient = require("mongodb").MongoClient;
const fs = require('fs');
fs.writeFileSync("/tmp/pidMonito", process.pid);

var server = http.createServer(function(req, res) {

  var params = querystring.parse(url.parse(req.url).query);
  var result = "";
  var devices = undefined;
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });
    console.log("[+] connection to Monitoanneau.")
  MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
      if (error) throw error;
      console.log("[+] connected to Monitoanneau/");
      var db = client.db('monitoanneau');
      selectOption();
      return;
      function selectOption() {
        if ('insert' in params) {
          insertInBDD();
        }
        if ('find' in params) {
          findInBDD();
        }
      }
      function findInBDD() {
        if ('collection' in params) {
          db.collection(params['collection']).find().toArray(function(error, results) {
            if (error) throw error;
            if (results.length != 0) {
              devices = results;
              selectInbDD();
            } else {
              console.error("[!] collection " + params['collection'] + " not found.");
            }
          });
        } else
          console.error("[!] pas de nom de coollection...");

      }
      function selectInbDD() {
        var tmp = params;
        delete tmp.find;
        delete tmp.collection;
        for (key in params) {
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
        db.collection(params['collection']).insert(params, null, function(error, results) {
          if (error) throw error;
          console.log("[+] Document inséré")
        });
        res.end();
        return
      }
  });
});
server.listen(8080);
