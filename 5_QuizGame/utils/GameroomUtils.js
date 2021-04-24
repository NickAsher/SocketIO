const Gameroom = require('../data/classes/Gameroom') ;
const fs = require('fs') ;


let mapOfCurrentlyUsedGamerooms ;

const initMapOfCurrentlyUsedGamerooms = ()=>{
  mapOfCurrentlyUsedGamerooms = new Map() ;

  try {
    const dataBuffer = fs.readFileSync(__dirname + './../data/fake_db/gameroom_data.json') ;
    const dataJSON = dataBuffer.toString() ;
    let jsonObject =  JSON.parse(dataJSON) ;

    for(const gamerooomKey in jsonObject){
      let gameCode = jsonObject[gamerooomKey]['gameCode'];
      let creationTime = jsonObject[gamerooomKey]['creationTime'] ;
      let players = jsonObject[gamerooomKey]['players'] ;

      mapOfCurrentlyUsedGamerooms.set(gamerooomKey, new Gameroom(gameCode, creationTime, players)) ;
    }
  } catch (e) {
    console.log(e) ;
    console.log("Cannot initialise mapOfCurrentlyUsedGamerooms") ;
  }
} ;

const saveMapOfCurrentlyUsedGamerooms = ()=>{
  let jsonObject = {};
  for(const [key,value] of mapOfCurrentlyUsedGamerooms.entries()){
    jsonObject[key] = value.toJSON() ;
  }
  fs.writeFileSync(__dirname + './../data/fake_db/gameroom_data.json', JSON.stringify(jsonObject)) ;
} ;


const createRandomGameCode=()=>{
  let result = [];
  let characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let charactersLength = characters.length;  //58
  for ( let i = 0; i < 6; i++ ) {
    //Math.random =                 => returns a decimal number between 0 & 1         like  0.454689
    // Math.random() * 58           =>   any decimal number between 0 & 57.99         like  0.454689 * 58 = 26.371
    // Math.floor(5.6764)= 5        => so it returns an integer number between 0 & 57    like floor(26.371) = 26
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  let randomGameCode =  result.join('');

  if(mapOfCurrentlyUsedGamerooms.get(randomGameCode) != null){  // i.e. chatroom already exists
    //call this method again using recursion
    randomGameCode = createRandomGameCode() ;
  }
  console.log("The random game code generated is " + randomGameCode) ;
  return randomGameCode ;
} ;


const createNewGameroom = (firstPlayerName)=>{
  let randomGameCode = createRandomGameCode() ;
  let newGameroom = new Gameroom(randomGameCode, (new Date()).getTime(), [firstPlayerName]) ;
  mapOfCurrentlyUsedGamerooms.set(randomGameCode, newGameroom) ;
  saveMapOfCurrentlyUsedGamerooms() ;
  return newGameroom ;
} ;



//TODO make sure you check that max only 2 people are joined in a room
const addUserToChatroom = (gameCode, newUserName, )=>{
  //firstly check if chatroom is not null
  if(mapOfCurrentlyUsedGamerooms.get(gameCode) == null) {
    console.log(`Err : You tried to add the user ${newUserName} to game ${gameCode}, but no such gameCode exists `) ;
    return 'GAMECODE_INVALID' ; // chatroom does not exist
  }

  if(mapOfCurrentlyUsedGamerooms.get(gameCode).players.length >= 2){
    // there are already 2 or more users in the game.
    console.log(`Err : Max User limit reached. Can't add more players to game ${gameCode}`) ;
    return 'USER_LIMIT_REACHED' ;
  }

  mapOfCurrentlyUsedGamerooms.get(gameCode).addPlayer(newUserName) ;
  saveMapOfCurrentlyUsedGamerooms() ;
  return mapOfCurrentlyUsedGamerooms.get(gameCode) ;
} ;




module.exports = {
  initMapOfCurrentlyUsedGamerooms,
  createNewGameroom,
  addUserToChatroom
} ;