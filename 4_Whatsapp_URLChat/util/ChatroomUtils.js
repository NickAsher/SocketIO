const fs = require('fs') ;
const Chatroom = require('../data/classes/Chatroom_backend') ;

let listOfCurrentlyUsedChatrooms ;


const init_ListOfCurrentlyUsedChatrooms=()=>{
  listOfCurrentlyUsedChatrooms = new Map() ;

  try {
    const dataBuffer = fs.readFileSync(__dirname + './../data/fake_db/chatroom_data.json') ;
    const dataJSON = dataBuffer.toString() ;
    let jsonObject =  JSON.parse(dataJSON) ;

    for(const key in jsonObject){
      let chatroomName = jsonObject[key]['name'] ;
      let chatroomStatus = jsonObject[key]['name'] ;
      let chatroomPath = jsonObject[key]['name'] ;

      listOfCurrentlyUsedChatrooms.set(key, new Chatroom(chatroomName, chatroomStatus, chatroomPath)) ;
    }

  } catch (e) {
    console.log(e) ;
    console.log("Cannot initialise listOfCurrentlyUsedChatrooms") ;

  }
} ;


const saveListOfCurrentlyUsedChatrooms = ()=>{
  let jsonObject = {};
  for(const [key,value] of listOfCurrentlyUsedChatrooms.entries()){
    jsonObject[key] = value.toJSON() ;
  }
  fs.writeFileSync(__dirname + './../data/fake_db/chatroom_data.json', JSON.stringify(jsonObject)) ;
} ;



const getChatroomByPath=(chatroomPath)=>{
  return listOfCurrentlyUsedChatrooms.get(chatroomPath) ;
} ;


const createNewChatroom=(chatroomName, chatroomStatus, chatroomPath)=>{
  // check if a chatroom with this path already exists
  if(listOfCurrentlyUsedChatrooms.get(chatroomPath) != null){
    console.log(`Err : You tried to crate a new chatroom with path  ${chatroomPath}, but it already exists`) ;
    return listOfCurrentlyUsedChatrooms.get(chatroomPath) ;
  }

  let newChatroom = new Chatroom(chatroomName, chatroomStatus, chatroomPath) ;
  listOfCurrentlyUsedChatrooms.set(chatroomPath, newChatroom) ;

  saveListOfCurrentlyUsedChatrooms() ;
  return newChatroom ;
} ;

const createRandomLink=()=>{
  //TODO create the random link here
  let result = [];
  let characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let charactersLength = characters.length;  //58
  for ( let i = 0; i < 6; i++ ) {
    //Math.random =                 => returns a decimal number between 0 & 1    0.454689
    // Math.random() * 58           =>   any decimal number between 0 & 57.99
    // Math.floor(5.6764)= 5        => so it returns an integer number between 0 & 57
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  let randomLink =  result.join('');

  if(listOfCurrentlyUsedChatrooms.get(randomLink) != null){  // i.e. chatroom already exists
    //call this method again using recursion
    randomLink = createRandomLink() ;
  }
  console.log("The random link path generated is " + randomLink) ;
  return randomLink ;
} ;

const createNewChatroom_w_RandomLink = (chatroomName, chatroomStatus)=>{
  let randomLink = createRandomLink() ;
  let newChatroom = new Chatroom(chatroomName, chatroomStatus, randomLink) ;
  listOfCurrentlyUsedChatrooms.set(randomLink, newChatroom) ;

  saveListOfCurrentlyUsedChatrooms() ;
  return newChatroom ;

} ;


const addUserToChatroom = (chatroomPath, newUserName, )=>{
  //firstly check if chatroom is not null
  if(listOfCurrentlyUsedChatrooms.get(chatroomPath) == null) {
    console.log(`Err : You tried to add the user ${newUserName} to ${chatroomPath}, but no such chatroom exists `) ;
    return -1 ; // chatroom does not exist
  }

  listOfCurrentlyUsedChatrooms.get(chatroomPath).addUser(newUserName) ;
  saveListOfCurrentlyUsedChatrooms() ;
  return listOfCurrentlyUsedChatrooms.get(chatroomPath) ;
} ;


const deleteUserFromChatroom = (chatroomPath, userName)=>{
  // this function will perform two things
  //    1. delete a user from the chatroom
  //    2. if the there are no users left in a chatroom after deletion, then it will also delete that chatroom from listOfCurrentlyUserChatrooms


  //firstly check if chatroom is not null
  if(listOfCurrentlyUsedChatrooms.get(chatroomPath) == null) {
    console.log(`Err : You tried to delete the user ${userName} from ${chatroomPath}, but no such chatroom exists `) ;
    return -1 ; // chatroom does not exist
  }

  listOfCurrentlyUsedChatrooms.get(chatroomPath).deleteUser(userName) ;

  // if there aren't any users in the chatroom, then delete the chatroom too
  if(listOfCurrentlyUsedChatrooms.get(chatroomPath).currentUsers.length == 0){
    listOfCurrentlyUsedChatrooms.delete(chatroomPath) ;
  }

  saveListOfCurrentlyUsedChatrooms() ;
} ;





module.exports = {
  init_ListOfCurrentlyUsedChatrooms,
  getChatroomByPath,
  createNewChatroom,
  createNewChatroom_w_RandomLink ,
  addUserToChatroom,
  deleteUserFromChatroom
} ;