const express = require('express');
const http = require('http');
const sleep = require('sleep');

const app = express();

const words = ["Alpha","Beta","Cupcake","Donut","Eclaire","Froyo","Gingerbread","Honeycomb","Ice Cream Sandwhich","Jelly Bean","KitKat","Lollipop","Marshmallow","Nugat","Oreo","Pancake"];

app.listen(8080,function(){
  console.log("listening on port 8080");
  let choice = Math.floor(Math.random()*words.length);
  var wordBank = [];
  wordBank.push(words[choice]);
  console.log("Choice:",wordBank);
  while (true) {
    if (Math.random() > 0.7) {
      let choice = Math.floor(Math.random()*words.length);
      wordBank.push(words[choice]);
      console.log("Choice:",wordBank);
    }
    sleep.sleep(1);
  }
});
