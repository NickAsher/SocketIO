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
      listOfCurrentlyUsedChatrooms.set(key, new Chatroom(jsonObject[key])) ;
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

  // TODO update the chatroom in file storage

  //TODO delete the chatroom also if it empty

  //TODO write the updated listOfChatrooms in file storage

} ;





module.exports = {
  init_ListOfCurrentlyUsedChatrooms,
  getChatroomByPath,
  createNewChatroom,
  addUserToChatroom,
  deleteUserFromChatroom
} ;