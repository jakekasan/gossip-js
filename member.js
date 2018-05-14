
class Member {
  constructor(port){
    this.port = port;
    this.alive = getAliveState();
    this.info = getInfo();
    this.knownMembers = getKnownMembers();
  }

  async getKnownMembers(){
    try {
      let response = await fetch(this.port + "/members");
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
      let response = await fetch(this.port + "/info");
      let data = await response.json();
      console.log("Fetched info from",this.port);
      return data;
    } catch (e) {
      console.log("Failed to fetch info from",this.port);
      return;
    }
  }

  async getAliveState(){
    try {
      let response = await fetch(this.port + "/info");
      let data = await response.json();
      console.log("Checking if",this.port,"is alive");
      return data;
    } catch (e) {
      console.log(this.port,"is not alive");
      return;
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




}
