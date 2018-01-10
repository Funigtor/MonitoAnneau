var http = require('http'); //require serveur WEB
var url = require('url'); //pour les URL
var querystring = require('querystring');
var MongoClient = require("mongodb").MongoClient;

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
    if('piece' in params){
    db.collection("cuisine").find().toArray(function (error, results) {
        if (error) throw error;
        results.forEach(function(obj, i) {
          /*  console.log(
                  "ID : "  + obj._id.toString() + "\n" // 53dfe7bbfd06f94c156ee96e
                + "Jour: " + obj.date.jour + "\n"
                + "Mois: " + obj.date.mois + "\n"
                + "Jour: " + obj.date.annee + "\n"           // Adrian Shephard
                + "Device : " + obj.device                  // Half-Life: Opposing Force
            );*/
        });
        devices = results;
        desync();
    });
  }
});
  function desync(){
    //console.log(devices);
    if('device' in params){

    }
  }
});
server.listen(8080);
