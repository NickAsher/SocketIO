class Chatroom{

  constructor(name, path){
    this.name = name ;
    this.path = path ;
    this.currentUsers = [] ;
    // this.messageHistory = [] ;  // for future use, for keeping backup
  }

  addUser(newUser){
    this.currentUsers.push(newUser) ;
  }

}
module.exports = Chatroom ;