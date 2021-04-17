class Chatroom{

  constructor(name, status, img, path){
    this.name = name ;
    this.status = status ;
    this.img = img ;
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
      img :this.img,
      path : this.path
    } ;
  }

}
export {Chatroom}