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

  app.get('/vote/init',(req,res) => {

  });

  app.get('/',(req,res) => {
    //console.log("[GET] /");
    res.send(req);
  });

}
