class Gossiper {
  constructor(port,members) {
    this.port = port;
    this.members = members;
    this.info = []
  }

  gossipTo(member){

  }

  newMember(member){
    // check if member is alive
    console.log("Checking member at port",member.port);
    if (member.getAliveState()) {
      this.members.push(member);
    } else {
      console.log("Member at port", member.port,"not alive...");
    }
    this.members.push(member);
  }

  printInfo(member){
    if (member) {
      console.log("\nMember at port",member.port,"has",member.info.length,"pieces of information");
      for (var i = 0; i < member.info.length && i < 5; i++) {
        console.log("\t",member.info[i]);
      }
    } else {
      console.log("\nCurrent member at port",this.port,"has",this.info.length,"pieces of information");
      for (var i = 0; i < this.info.length; i++) {
        console.log("\t",this.info[i]);
      }
    }
  }


}
