var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données");
    var db = client.db('monitoanneau');
    for (j=1;j<=30;j++){
      for (k=0;k<24;k++){
        for (l=0;l<60;l++){
          var conso = (Math.floor(Math.random() * 10));
          var cuisine={
            device: "global",
            date: [{jour: j,mois: "01", annee: "2018"}],
            heure: [{heure: k, minute: l}],
            temp: (Math.floor(Math.random() * 5)+18),
            consoAmp: 10 };
          var four = {
            device: "four",
            date: [{jour: j,mois: "01", annee: "2018"}],
            heure: [{heure: k, minute: l}],
            consoAmp: conso };
          var lavevaiselle = {
            device: "lave-vaiselle",
            date: [{jour: j,mois: "01", annee: "2018"}],
            heure: [{heure: k, minute: l}],
            consoAmp: 10-conso};

          db.collection("cuisine").insert(cuisine,null,function(error,results){
            if (error) throw error;
          })
          db.collection("cuisine").insert(four,null,function(error,results){
            if (error) throw error;
          })
          db.collection("cuisine").insert(lavevaiselle,null,function(error,results){
            if (error) throw error;
          })

          var salon={
            device: "global",
            date: [{jour: j,mois: "01", annee: "2018"}],
            heure: [{heure: k, minute: l}],
            temp: (Math.floor(Math.random() * 5)+18),
            consoAmp: 4 };
          var tele = {
            device: "tele",
            date: [{jour: j,mois: "01", annee: "2018"}],
            heure: [{heure: k, minute: l}],
            consoAmp: 4 };

          db.collection("salon").insert(salon,null,function(error,results){
            if (error) throw error;
          })
          db.collection("salon").insert(tele,null,function(error,results){
            if (error) throw error;
          })
        }
      }
    };
    console.log("fini");

});
