var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données 'tutoriel'");
    var db = client.db('monitoanneau');

    for (i=1;i<31;i++){
      var essaie = {_id:i,
                    piece: "cuisine",
                    date: [{jour: i, mois: "janvier", annee: "2018"}],
                    heure: [{heure: "0", minute: i}],
                    temperature: 20+i%5};

      db.collection("temp").insert(essaie,null,function(error,results){
        if (error) throw error;
        console.log("Le document a bien été inséré");
      })
    }


});
