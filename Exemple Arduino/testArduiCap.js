const SerialPort = require('serialport');
const request = require('request');
const http = require('http');

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
