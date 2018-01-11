var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données");
    var db = client.db('monitoanneau');

    var SerialPort = require('serialport');
    const Readline = SerialPort.parsers.Readline;
    const port = new SerialPort('/dev/ttyACM0');
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', mabite);

     function mabite(data){
      var start = new Date();
      console.log(start.getHours()+':'+start.getMinutes()+':'+start.getSeconds()+'---'+start.getDate()+':'+(start.getMonth()+1)+':'+start.getFullYear());
      console.log(data);

      var chambre={
        device: "global",
        date: [{jour: start.getDate(),mois: (start.getMonth()+1), annee: start.getFullYear()}],
        heure: [{heure: start.getHours(), minute: start.getMinutes()}],
        temp: data};

        db.collection("chambre").insert(chambre,null,function(error,results){
          if (error) throw error;
          console.log("donnees envoye");
        })
    }

});


/*var sp = new SerialPort('/dev/ttyACM0', {
  parser: SerialPort.parsers.raw,baudRate: 9600
});

sp.on("open", function() {
  console.log('open');
  sp.on('data', function (data) {
    console.log('Data: ' + data);
  });
});*/

/*var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données");

});
*/

/*
var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/ttyACM0");

serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
      console.log(data);

  });
});*/
