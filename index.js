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

    for(key in params){console.log(key);}


    if ('piece' in params) {
      db.collection(params['piece']).find().toArray(function(error, results) {
        if (error) throw error;
        if (results.length != 0) {
          devices = results;
          console.log("coollections " + results.length);
          desync(db);
        } else {
          console.error("collection " + params['piece'] + " not found.");
          //res.write("collection " + params['device'] + " not found.");
          //res.end();
        }
      });
    }
  });

  function desync(db) {
    console.log("[?] params :" + JSON.stringify(params));

    //console.log(devices);
    if ('input' in params) {
      params.input = undefined;
      db.collection(params.piece).insert(params, null, function(error, results) {
        if (error) throw error;
        console.log("Document inséré")
      });
      res.end();
      return
    }

    if ('device' in params) {

      var tmp = new Array();
      devices.forEach(function(elmnt, index) {
        if (elmnt.device === params['device']) tmp.push(elmnt);
        //console.log(elmnt);
      });
      devices = tmp;
      if (devices.length === 0) {
        console.error(params['device'] + "n'existe pas ! \n exit()");
        return;
      }
      //console.log(device);
    }
    var dateDebut = false;
    var dateFin = false;
    if ('dd' in params) {
      dateDebut = isADate(params['dd']);
      console.log(dateDebut);
    }
    if ('df' in params) {
      dateFin = isADate(params['df']);
      console.log(dateFin);
    }
    if (dateDebut || dateFin) {
      tmp = new Array();
      devices.forEach(function(obj, i) {
        if (inInterval(dateDebut, dateFin, obj.date[0], obj.heure[0])) {
          tmp.push(obj);
          //console.log("[+] Push");
        }
      });
      devices = tmp;
    }
    var string = JSON.stringify(devices)
    res.write(string);
    res.end();
    console.log("[+] Done.");
  }

  function isADate(chaine) {
    var regDate = new RegExp("\\d\\d/\\d\\d/\\d\\d\\d\\d");
    if (regDate.test(chaine)) {
      //console.log(chaine + " passe dans l'expression rég");
      var regex = /\s?([/])\s?/;
      var resultat = chaine.split(regex);
      resultat = [parseInt(resultat[0]), parseInt(resultat[2]), parseInt(resultat[4])];
      if (resultat[0] <= 31 && resultat[1] < 12) {
        return resultat;
      }
    } else console.error(chaine + " n'est PAS une date !!!");
  }

  function inInterval(debut, fin, date, heure) {
    if (!debut) {
      if (parseInt(date.jour) <= fin[0] && parseInt(date.mois) <= fin[1] && parseInt(date.annee) <= fin[2]) {
        //console.log(date.jour, fin[0] , parseInt(date.mois) , fin[1] , parseInt(date.annee) , fin[2]);
        //console.log(parseInt(date.jour), debut[0] , parseInt(date.mois) , debut[1] , parseInt(date.annee) , debut[2]);
        //console.log("true");
        return true;
      }
    }
    if (!fin) {
      if (parseInt(date.jour) >= debut[0] && parseInt(date.mois) >= debut[1] && parseInt(date.annee) >= debut[2]) {
        //console.log(date.jour, fin[0] , parseInt(date.mois) , fin[1] , parseInt(date.annee) , fin[2]);
        //console.log(parseInt(date.jour), debut[0] , parseInt(date.mois) , debut[1] , parseInt(date.annee) , debut[2]);
        //console.log("true");
        return true;
      }
    }
    if ((parseInt(date.jour) <= fin[0] && parseInt(date.mois) <= fin[1] && parseInt(date.annee) <= fin[2]) && (parseInt(date.jour) >= debut[0] && parseInt(date.mois) >= debut[1] && parseInt(date.annee) >= debut[2])) {
      //console.log(date.jour, fin[0] , parseInt(date.mois) , fin[1] , parseInt(date.annee) , fin[2]);
      //console.log(parseInt(date.jour), debut[0] , parseInt(date.mois) , debut[1] , parseInt(date.annee) , debut[2]);
      console.log("true");
      return true;
    }
    return false;
  }
});
server.listen(8080);
