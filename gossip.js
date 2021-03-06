const fetch = require('node-fetch');
const Member = require('./member.js');

module.exports = class Gossiper {
  constructor(name,port,members,knownPorts) {
    this.name = name;
    this.port = port;
    this.members = members;
    this.data = [];
    this.startPorts = 8000;
    this.endPorts = 8020;
    this.isVoting = false
  }

  gossipTo(member){
    member.gossipTo(this.data);
  }

  newMember(member){
    // check if member is alive
    console.log("Checking member at port",member.port);
    member.getAliveState().then(res => res.json()).then(res => console.log(res)).catch(() => {});
  }

  addMemberFromPort(port){
    if (port == this.port) {
      return
    }
    for (let member of this.members) {
      if (member.port == port) {
        return
      }
    }
    let existingPorts = this.members.map(member => { return member.port });
    if (existingPorts.includes(port) || port == undefined || port == this.port) {
      return
    } else {
      fetch('http://localhost:'+port+'/info').then(res => res.json()).then(json => this.members.push(new Member(json.name,json.port))).catch(() => {});
    }

  }

  checkMembers(){
    if (this.members.length < 1) {
      return;
    }
    for (let member of this.members) {
      if (Math.random() < ((member.alive) ? 0.25 : 0.1)) {
        member.getAliveState().then(res => res.json()).then(() => member.alive = true).catch(() => member.alive = false)
      }
    }
  }

  discoverMembers(){
    let port = Math.floor(Math.random() * (this.endPorts - this.startPorts)) + this.startPorts;
    if (Math.random() < 0.25) {
      this.addMemberFromPort(port);
    } else {
      this.askForMembers();
    }
  }

  askForMembers(){
    if (this.members.length < 1) {
      return
    }
    let member = this.members[Math.floor(Math.random()*this.members.length)];
    member.getKnownMembers().then(res => res.json()).then(data => { (data) ? this.addMemberFromPort(data.port) : undefined }).catch(() => {});
  }

  compareInfo(){
    if (this.members.length < 1) {
      return;
    }
    for (let member of this.members) {
      if (member.alive) {
        member.getData().then(res => res.json()).then(data => {
          if (data.length > this.data.length) {
            if (!data.map(x => { return badWords.includes(x) }).includes(true)) {
              this.data = data;
            }
          }
        }).catch(() => {});
      }
    }
  }

  printFullUpdate(){
    // print name, port and number of known members as well as the information the Gossiper possesses
    console.log("Name:",this.name,", Port:",this.port,"Number of members:",this.members.length,", Number of infos:",this.data.length);
    console.log("Last few infos:",this.data.slice(-5));
  }

  infoString(){
    return JSON.stringify({
      "name":this.name,
      "port":this.port
    });
  }

  dataString(){
    return JSON.stringify(this.data);
  }

  memberString(){
    if (this.members.length < 1) {
      return JSON.stringify([]);
    }
    let member = this.members[Math.floor(Math.random()*this.members.length)].getString();
    if (member == undefined){
      return []
    }
    return JSON.stringify(member);
  }

  passTime(){
    this.compareInfo();
    this.printFullUpdate();
    this.discoverMembers();
    let prob = 0.5;
    if (this.data.map(x => { badWords.includes(x) }).includes(true)) {
      prob = 0.01;
    }
    if (Math.random() < prob) {
      this.addAWord();
    }
  }

  addAWord(){
    if (Math.random() < 0.01) {
      this.data.push(badWords[Math.floor(Math.random()*badWords.length)]);
    } else {
      this.data.push(goodWords[Math.floor(Math.random()*goodWords.length)]);
    }
  }

  printMembers(){
    for (let member of this.members){
      console.log(member.name,member.port);
    }
  }

  // update lifecycle

  update(){
    // first, pick 5 (or so) random members to do a heartbeat with

    let dataPromises = []

    let chosenMembers = [];

    // if we have a new block, broadcast this to the 5 members

    for (let i = 0; i < 5; i++) {
      let selection = Math.floor(Math.random()*this.members.length);
      let member = this.members[selection];
      chosenMembers.push(member);
      dataPromises.push(member.getData());
    }

    if (this.newBlockAvailable){
      // broadcast new block to the 5 members
      for (let member of chosenMembers) {
        member.broadcastData();
      }
    }


    // now check for new pieces of information

    let results = Promise.all(dataPromises).then(results => {
      return results.map(result => { return result.json() })
    }).catch(err => console.log(err));

    // filter out un-unique data

    results = results.filter(data => compareDateWithMine(data));

    results.push(this.data);

    // if length of results is more than one, initiate a vote

    if (results.length > 1) {
      // initiate vote
      // this.doVote(chosenMembers,results);
      this.data = results[Math.floor(Math.random()*results.length)];
    } else {
      this.data = this.data;
    }
  }

  // ****************************
  // ********* VOTING ***********
  // ****************************
  /*

  This is now irrelevant, as each gossiper will either use
  a pre-defined scoring function for each info (if there
  should be more than one valid) or pick one at random.
  Either way, alternative info should still be able to
  propagate through the network.

  */

  doVote(members,results){
    // prompt members for vote
    let voteResults = Promise.all(members.map(member => { return member.getVote(results) })).then(results => {
      return results.map(result => { return result.json() });
    })
    .catch(err => console.log(err));
  }


  respondToVoteInit(data){
    // voting logic
    // in the future, this would check each choice for validity of each other data point before proceeding
    // right now, this just randomly chooses from one of the elements given and returns it
    let reply = []
    reply.push(data[Math.floor(Math.random()*data.length)]);
    return reply;
  }

  recieveVoteConclude(data){
    this.data = JSON.stringify(data);
    return
  }

  compareDateWithMine(data){
    if (this.data.length != data.length){
      return false;
    }
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i] != data[i]){
        return false;
      }
    }
    return true;
  }

  getUniqueData(dataArr){
    let valid = [];
    for (let data of dataArr) {

    }
  }

}

//
// badWords = ["boobs","whoopie","mashugga","chicken"]
// goodWords = ["alpha","beta","cupcake","donut","eclaire","froyo","gingerbread","honeycomb","ice cream sandwhich","jelly bean","kitkat","lollipop","marshmallow","nugat","oreo","pancake"]

badWords = [1,2,3,4,5,6,7,8,9,0]
goodWords = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
