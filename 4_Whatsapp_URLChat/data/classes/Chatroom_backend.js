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

  deleteUser(userNameToDelete){
    // all the elements matching the filter criteria will remain in the new array
    let newUsersArray = this.currentUsers.filter((userName)=>{
      // all those userName which are not equal to the 'userNameToDelete' will remain in the new array
      return userNameToDelete != userName ;
    }) ;

    this.currentUsers = newUsersArray ;
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
