const Gameroom = require('../data/classes/Gameroom') ;
const fs = require('fs') ;


let mapOfCurrentlyUsedGamerooms ;


const getGameroom = (gameCode) =>{
  return mapOfCurrentlyUsedGamerooms.get(gameCode) ;
} ;

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
  console.log("Saving the list of used chatrooms ") ;
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


const createNewGameroom = (firstPlayer)=>{
  let randomGameCode = createRandomGameCode() ;
  let newGameroom = new Gameroom(randomGameCode, (new Date()).getTime(), [firstPlayer]) ;
  mapOfCurrentlyUsedGamerooms.set(randomGameCode, newGameroom) ;
  saveMapOfCurrentlyUsedGamerooms() ;
  return newGameroom ;
} ;



const addUserToChatroom = (gameCode, newPlayer, )=>{
  //firstly check if chatroom is not null
  if(mapOfCurrentlyUsedGamerooms.get(gameCode) == null) {
    console.log(`Err : You tried to add the user ${newPlayer.name} to game ${gameCode}, but no such gameCode exists `) ;
    return 'GAMECODE_INVALID' ; // chatroom does not exist
  }

  if(mapOfCurrentlyUsedGamerooms.get(gameCode).players.length >= 2){
    // there are already 2 or more users in the game.
    console.log(`Err : Max User limit reached. Can't add more players to game ${gameCode}`) ;
    return 'USER_LIMIT_REACHED' ;
  }

  mapOfCurrentlyUsedGamerooms.get(gameCode).addPlayer(newPlayer) ;
  saveMapOfCurrentlyUsedGamerooms() ;
  return mapOfCurrentlyUsedGamerooms.get(gameCode) ;
} ;


const deleteUserFromGameroom = (gameCode, socketId)=>{
  let gameRoom = mapOfCurrentlyUsedGamerooms.get(gameCode) ;
  gameRoom.removePlayer(socketId) ;

  if(gameRoom.players.length == 0){
    mapOfCurrentlyUsedGamerooms.delete(gameCode) ;
  }

  saveMapOfCurrentlyUsedGamerooms() ;
} ;




const setupGameroomAnswers = (gameCode, listOfQuestions)=>{
  let answerArray = [] ;
  listOfQuestions.forEach((questionJsonObject)=>{

    answerArray.push(questionJsonObject.correct_option) ;
  }) ;
  console.log(answerArray) ;
  mapOfCurrentlyUsedGamerooms.get(gameCode).setupGameData(answerArray) ;
  saveMapOfCurrentlyUsedGamerooms() ;
} ;


const setup_AnswerGiven_byPlayer = (gameCode, questionNo, playerNo, selectedOption)=>{
  mapOfCurrentlyUsedGamerooms.get(gameCode).addRoundScore(questionNo, playerNo, selectedOption) ;
  saveMapOfCurrentlyUsedGamerooms() ;

  // check if both the players have answered the round or not, if both have answered then return 2, else return 1
  if(mapOfCurrentlyUsedGamerooms.get(gameCode).gameData[questionNo]['p1_selected_option'] != null &&
      mapOfCurrentlyUsedGamerooms.get(gameCode).gameData[questionNo]['p2_selected_option'] != null){
    return 2 ;
  }else{
    return 1 ;
  }
} ;



module.exports = {
  initMapOfCurrentlyUsedGamerooms,
  getGameroom,
  createNewGameroom,
  addUserToChatroom,
  deleteUserFromGameroom,
  setupGameroomAnswers,
  setup_AnswerGiven_byPlayer
} ;