class User {
  constructor(name, socketId){
    this.name = name ;
    this.socketId = socketId ;
  }

  toJSON(){
    return {
      name : this.name,
      socketId : this.socketId
    } ;
  }
}

module.exports = User ;