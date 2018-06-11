const Member = require('./member.js');


module.exports = function(app,gossiper){
  app.get('/info',(req,res) => {
    res.setHeader('Content-Type','application/json');
    res.send(gossiper.infoString());
  });

  app.get('/data',(req,res) => {
    res.setHeader('Content-Type','application/json');
    res.send(gossiper.dataString());
  });

  app.get('/members',(req,res) => {
    res.setHeader('Content-Type','application/json');
    res.send(gossiper.memberString());
  });

  app.post('/vote/init',(req,res) => {
    // ideally this should include some sort of handshake
    // but thats irrelevant because the "vote" mechanism
    // is actually unnecessary as long as there is some way
    // to compare 2 pieces of data by quality (not just length)

    res.send(gossiper.respondToVote(req.body));
  });

  app.post('/vote/conclude',(req,res) => {
    // the accepted choice is broadcast back
    gossiper.recieveVoteConclude(req.body);
  });

  app.get('/',(req,res) => {
    //console.log("[GET] /");
    res.send(req);
  });

}
