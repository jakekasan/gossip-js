const fetch = require('node-fetch');
const Member = require('./member.js');

module.exports = class Gossiper {
  constructor(name,port,members,knownPorts) {
    this.name = name;
    this.port = port;
    this.members = members;
    this.info = [];
    this.startPorts = 8000;
    this.endPorts = 8020;
  }

  gossipTo(member){
    member.gossipTo(this.info);
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

  addMemberFromPort(port){
    console.log("Fetching data...");
    fetch('http://localhost:'+port+'/info').then(res => res.json()).then(json => this.members.push(new Member(json.name,json.port))).then(() => { console.log("Member successfully added..."); }).catch(e => console.log("Could not connect to member at port:",port));
  }

  checkMembers(){
    if (this.members.length < 1) {
      return;
    }
    for (let member of this.members) {
      if (Math.random() < ((member.alive) ? 0.25 : 0.1)) {
        if (!member.getAliveState()) {
          member.alive = false;
        }
      }
    }
  }

  discoverMembers(){
    let port = Math.floor(Math.random() * (this.endPorts - this.startPorts)) + this.startPorts;
    if (Math.random() < 0.25) {
      this.addMemberFromPort(port);
    }
  }

  compareInfo(){
    if (this.members.length < 1) {
      return;
    }
    let knownInfo = [];
    for (let member of this.members) {
      if (member.alive) {
        knownInfo.push(member.getInfo());
      }
    }
    knownInfo = knownInfo.filter(info => this.isInfoValid(info));
    let lenToBeat = this.info.length;
    for (let info of knownInfo){
      if (lenToBeat < info.length) {
        console.log("Replacing information");
        lenToBeat = info.length;
        this.info = info;
      }
    }
  }

  isInfoValid(info){
    for (let word of info) {
      if (badWords.includes(word)) {
        return false;
      }
    }
    return true;
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

  printFullUpdate(){
    // print name, port and number of known members as well as the information the Gossiper possesses
    console.log("Name:",this.name,"Port:",this.port,"Number of members aware of:",this.members.length);
    console.log("Last few infos:",this.info.slice(-5));
  }

  infoString(){
    return JSON.stringify({
      "name":this.name,
      "port":this.port
    });
  }

  dataString(){
    let info = JSON.stringify(this.info);
    return JSON.stringify({
      "info":info
    });
  }

  memberString(){
    let member = this.members[Math.floot(Math.random()*this.members.length)].getString();
    return JSON.stringify(member);
  }

  passTime(){
    this.compareInfo();
    this.printFullUpdate();
    this.discoverMembers();
    if (Math.random() < 0.5) {
      //console.log(this.name,"at",this.port,"is adding a word");
      this.addAWord();
    }
  }

  addAWord(){
    if (Math.random() < 0.1) {
      this.info.push(badWords[Math.floor(Math.random()*badWords.length)]);
    } else {
      this.info.push(goodWords[Math.floor(Math.random()*goodWords.length)])
    }
  }
}


badWords = ["boobs","whoopie","mashugga","chicken"]
goodWords = ["alpha","beta","cupcake","donut","eclaire","froyo","gingerbread","honeycomb","ice cream sandwhich","jelly bean","kitkat","lollipop","marshmallow","nugat","oreo","pancake"]
