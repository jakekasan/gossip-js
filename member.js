const fetch = require('node-fetch');


module.exports = class Member {
  constructor(name,port){
    this.name = name;
    this.port = port;
    this.alive = this.getAliveState().then(() => true).catch(() => false);
    this.info = this.getInfo().then(res => res.json()).catch(() => []);
    this.knownMembers = this.getKnownMembers().then(res => res.json()).catch(() => []);
  }


  getKnownMembers(){
    return fetch("http://localhost:" + this.port + "/members");
  }

  getInfo(){
    return fetch("http://localhost:" + this.port + "/data");
  }

  getAliveState(){
    return fetch("http://localhost:" + this.port + "/info");
  }

  printInfo(member){
    if (member) {
      console.log("\nMember at port",member.port,"has",member.info.length,"pieces of information");
      for (var i = 0; i < member.info.length && i < 5; i++) {
        console.log("\t",member.info[i])
      }
    } else {
      console.log("\nCurrent member at port",this.port,"has",this.info.length,"pieces of information");
      for (var i = 0; i < this.info.length; i++) {
        console.log("\t",this.info[i])
      }
    }
  }

  getVoteInit(){
    // return a promise
  }

  getVoteRound(){}

  getString(){
    return {
      "name":this.name,
      "port":this.port
    };
  }




}
