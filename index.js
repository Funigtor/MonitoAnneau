var http = require('http'); //require serveur WEB
var url = require('url'); //pour les URL
var querystring = require('querystring');
var MongoClient = require("mongodb").MongoClient;

var server = http.createServer(function(req, res) {

  var params = querystring.parse(url.parse(req.url).query);
  var result = "";
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données 'monitoanneau'");

    var db = client.db('monitoanneau');
    let coll;
    var devices = undefined;

    if ('piece' in params) {
      result += "piece: " + params['piece'] + '\n';
      coll = params['piece'];
      db.collection(coll,function(err,myCollection){
        myCollection.find().toArray(function(err, items) {
                 console.log(items);

             });
      });
     console.log("devices: "+devices);
    }
    if ('device' in params) {
      console.log('device: ' + params['device']);

      db.collection(coll).find().toArray(function(error, results) {
        if (error) throw error;

        results.forEach(function(elmnt,index,array){
          if(elmnt.device === params['device']) devices.push(elmnt);
        });
        console.log(devices);
      });
    }else{
      result += "device: " + params['device'] + '\n';

      db.collection(coll).find().toArray(function(error, results) {
        if (error) throw error;

        /*console.log(results);
        results.forEach(function(obj, i) {
          console.log(
            "Device : " + obj.device + "\n" +
            "date : " + obj.date + "\n" +
            "heure : " + obj.date["heure"] + "\n" +
            "temperature :" + obj.temperature + "\n" +
            "Consommation (A): " + obj.consoAmp + "\n"
          );
        });*/

    });
  }
    if ('dd' in params  ) {
      if('df' in params){
        result += "Date Début: " + params['dd'] + '\n' + "Date fin: " + params['df'] + '\n';
        console.log(result);
      }else{
        result += "Date Début: " + params['dd'] + '\n' + "Date fin:" + "DerniereDate" + '\n';
      }





    } else {
      result += "DernièreDate \n";
      console.log(result);
    }
    if ('chart' in params) {
      result += " affichage Chart";
    } else {
      result += "affichage JSON";
    }
    res.write(result);
    res.end();

});
});
server.listen(8080);
