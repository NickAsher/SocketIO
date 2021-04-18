class Chatroom{

  constructor(name, status, path){
    this.name = name ;
    this.status = status ;
    this.path = path ;
    this.currentUsers = [] ;
    // this.messageHistory = [] ;  // for future use, for keeping backup
  }

  addUser(newUser){
    this.currentUsers.push(newUser) ;
  }

  toJSON(){
    return {
      name : this.name,
      status : this.status,
      path : this.path
    } ;
  }



}
module.exports = Chatroom ;
