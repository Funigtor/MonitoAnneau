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
    if ('piece' in params) {
      db.collection("cuisine").find().toArray(function(error, results) {
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

  function desync() {
    //console.log(devices);
    if ('device' in params) {
      var tmp = new Array();
      devices.forEach(function(elmnt, index) {
        if (elmnt.device === params['device']) tmp.push(elmnt);
        //console.log(elmnt);
      });
      device = tmp;
      //console.log(device);
    }
    if ('dd' in params) {
      var dateDebut = isADate(params['dd']);
      console.log(dateDebut);
      if ('df' in params) {
        console.log(params['df']);
        var dateFin = isADate(params['df']);


        device.forEach(function(obj, i) {
          if(inInterval(dateDebut,dateFin,obj.date[0],obj.heure[0]))
            console.log('bkdflb');
          /*console.log(
                "ID :     " + obj._id.toString() + "\n"
              + "Date:    " + obj.date[0].jour   + " / " + obj.date[0].mois + " / " +  obj.date[0].annee + "\n"
              + "Heure:   " + obj.heure[0].heure + ' : ' + obj.heure[0].minute + "\n"
              + "Device : " + obj.device + '\n\n'
          );*/

        });
      }
    }
  }

  function isADate(chaine) {
    var regDate = new RegExp("\\d\\d/\\d\\d/\\d\\d\\d\\d");
    if (regDate.test(chaine)) {
      console.log(chaine + " passe dans l'expression rég");
      var regex = /\s?([/])\s?/;
      var resultat = chaine.split(regex);
      resultat = [parseInt(resultat[0]), parseInt(resultat[2]), parseInt(resultat[4])];
      if (resultat[0] <= 31 && resultat[1] < 12) {
        return resultat;
      }
    } else console.error(chaine + " n'est PAS une date !!!");
  }
  function inInterval(debut,fin,date,heure){
    if(date.jour < fin[0] && date.mois < fin[1] && date.annee < fin[2])
      console.log("true");
    else
    console.log(date.jour, fin[0] , date.mois , fin[1] , date.annee , fin[2]);
      console.log("false");
  }
  res.end();
});
server.listen(8080);
