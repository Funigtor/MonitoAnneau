var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://monito:friteusse@145.239.78.38:587/monitoanneau", function(error, client) {
    if (error) return funcCallback(error);

    console.log("Connecté à la base de données 'tutoriel'");
    var db = client.db('monitoanneau');
    
    db.collection("test").find().toArray(function (error, results) {
         if (error) throw error;
         results.forEach(function(obj, i) {
             console.log(
               "ID : "  + obj._id+ "\n" // 53dfe7bbfd06f94c156ee96e
              +"Nom : " + obj.name + "\n"           // Adrian Shephard
              +"Jeu : " + obj.game                  // Half-Life: Opposing Force
             );
         });
     });

});
