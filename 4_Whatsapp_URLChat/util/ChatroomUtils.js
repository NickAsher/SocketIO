const fs = require('fs') ;
const Chatroom = require('../data/classes/Chatroom_backend') ;

let listOfCurrentlyUsedChatrooms ;


const init_ListOfCurrentlyUsedChatrooms=()=>{
  if(listOfCurrentlyUsedChatrooms == null){
    //TODO read the list of chatrooms from file storage, if that is also empty, then initialise a new Map
    listOfCurrentlyUsedChatrooms = new Map() ;
  }
} ;


const getChatroomByPath=(chatroomPath)=>{
  return listOfCurrentlyUsedChatrooms.get(chatroomPath) ;
} ;


const createNewChatroom=(chatroomName, chatroomStatus, chatroomPath)=>{
  // check if a chatroom with this path already exists
  if(listOfCurrentlyUsedChatrooms.get(chatroomPath) != null){
    console.log(`Err : You tried to crate a new chatroom with path  ${chatroomPath}, but it already exists`) ;
    return -1;
  }

  let newChatroom = new Chatroom(chatroomName, chatroomStatus, chatroomPath) ;
  listOfCurrentlyUsedChatrooms.set(chatroomPath, newChatroom) ;

  //TODO append the new chatroom in File Storage


  return newChatroom ;
} ;

const addUserToChatroom = (chatroomPath, newUserName, )=>{

  //firstly check if chatroom is not null
  if(listOfCurrentlyUsedChatrooms.get(chatroomPath) == null) {
    console.log(`Err : You tried to add the user ${newUserName} to ${chatroomPath}, but no such chatroom exists `) ;
    return -1 ; // chatroom does not exist
  }

  listOfCurrentlyUsedChatrooms.get(chatroomPath).addUser(newUserName) ;

  // TODO update the chatroom in File Storage

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


function getListOfChatroomsFromFile(){

}

function writeListOfChatroomsToFile(){

}


module.exports = {
  init_ListOfCurrentlyUsedChatrooms,
  getChatroomByPath,
  createNewChatroom,
  addUserToChatroom,
  deleteUserFromChatroom
} ;