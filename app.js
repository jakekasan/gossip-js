const express = require('express');
const http = require('http');
const sleep = require('sleep');
const Gossiper = require('./gossip.js');
const router = require('./router.js');

var name;
var addr;
var knownAddr = [];

// get cmd line args
if (process.argv.length >= 4) {
  name = process.argv[2];
  addr = process.argv[3];
} else {
  name = "Jake";
  addr = 8080;
}

if (process.argv.length > 4) {
  knownAddr = JSON.parse(process.argv[4]);
}



const app = express();

const words = ["Alpha","Beta","Cupcake","Donut","Eclaire","Froyo","Gingerbread","Honeycomb","Ice Cream Sandwhich","Jelly Bean","KitKat","Lollipop","Marshmallow","Nugat","Oreo","Pancake"];

const gossip = new Gossiper(name,addr,[]);

router(app,gossip);

console.log("Known members:",knownAddr);

if (knownAddr.length > 0) {
  console.log("Known members given, attempting to contact...");
  for (let port of knownAddr) {
    gossip.addMemberFromPort(port);
  }
}

var gossipProcess = setInterval(() => {
  gossip.passTime();
},2000);

app.listen(addr,function(){
  console.log("Listening on port",addr);
});
