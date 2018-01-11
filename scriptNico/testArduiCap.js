var SerialPort = require('serialport');
const request = require('request');
var http = require('http');

const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyACM0');
const parser = new Readline();
port.pipe(parser);
parser.on('data', move);
function move(data ){
  var start = new Date();
  data = data.substring(0,data.length-1);
  console.log(data);
  var url = "http://145.239.78.38:80?insert&collection=chambre&device=temperature&valeur="+data;
  request(url, function(error, response, body) {});
}

/*  request("http://145.239.78.89:80?insert&collection=chambre&device=temperature&valeur="+data, function(err, res, body){
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
*/

/*var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
  if (error) return funcCallback(error);

  console.log("Connecté à la base de données");
  var db = client.db('monitoanneau');
  var chambre={
    device: "temperature",
    date: [{jour: start.getDate(),mois: (start.getMonth()+1), annee: start.getFullYear()}],
    heure: [{heure: start.getHours(), minute: start.getMinutes()}],
    value: data};

console.log(start.getHours()+':'+start.getMinutes()+':'+start.getSeconds()+'---'+start.getDate()+':'+(start.getMonth()+1)+':'+start.getFullYear());
console.log(data);
db.collection("chambre").insert(chambre,null,function(error,results){
  if (error) throw error;
  console.log("donnees envoye");
})
});*/
