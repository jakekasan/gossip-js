const Member = require('./member.js');


module.exports = function(app,gossiper){
  app.get('/info',(req,res) => {
    // return my information
    //console.log("[GET] /info");
    res.setHeader('Content-Type','application/json');
    res.send(gossiper.infoString());
  });

  app.get('/data',(req,res) => {
    // return my information
    //console.log("[GET] /data");
    res.setHeader('Content-Type','application/json');
    res.send(gossiper.dataString());
  });

  app.get('/members',(req,res) => {
    // return blank html
    //console.log("[GET] /members");
    res.setHeader('Content-Type','application/json');
    res.send(gossiper.memberString());
  });

  app.get('/',(req,res) => {
    //console.log("[GET] /");
    res.send(req);
  });

}
