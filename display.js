var ctx = document.getElementById("Chart").getContext("2d");

var config = new Object();
config.type = "line";
config.options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
};

// demande données
var url = document.location.href;
var jsonURL = url.replace("&chart","");
var req = new XMLHttpRequest();
req.open('GET', jsonURL, false); 
req.send(null);

if (req.status === 200) dataDevice = JSON.parse(req.responseText);
else console.log("Ça marche pas")

// reception données
var data = new Array();
for (document of dataDevice){
    data.push(document.temperature);
}
config.data = data;
var chart = new Chart(ctx, config);