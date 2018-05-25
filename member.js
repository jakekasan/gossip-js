const fetch = require('node-fetch');


class Member {
  constructor(name,port){
    this.name = name;
    this.port = port;
    this.alive = (this.getAliveState()) ? true : false;
    this.info = this.getInfo();
    this.knownMembers = this.getKnownMembers();
  }

  async getKnownMembers(){
    try {
      let response = await fetch("http://localhost:" + this.port + "/members");
      let data = await response.json();
      console.log("Fetched data from ",this.port);
      return data;
    } catch (e) {
      console.log("Failed to catch data from",this.port);
      return;
    }
  }

  async getInfo(){
    try {
      let response = await fetch("http://localhost:" + this.port + "/data");
      let data = await response.json();
      console.log("Fetched info from",this.port);
      return data;
    } catch (e) {
      console.log("Failed to fetch info from",this.port);
      return undefined;
    }
  }

  async getAliveState(){
    try {
      let response = await fetch("http://localhost:" + this.port + "/info");
      let data = await response.json();
      console.log("Checking if",this.port,"is alive");
      return true;
    } catch (e) {
      console.log(this.port,"is not alive");
      return false;
    }
  }

  async gossipTo(){
    return
    try {
      let response = await fetch("http://localhost:" + this.port + "/");
    } catch (e) {

    } finally {

    }
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

  getString(){
    return {
      "name":this.name,
      "port":this.port
    };
  }




}
