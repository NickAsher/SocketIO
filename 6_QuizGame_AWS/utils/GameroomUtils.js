const Gameroom = require('../data/classes/Gameroom') ;
const fs = require('fs') ;
require('dotenv').config() ;


let mapOfCurrentlyUsedGamerooms ;


const getGameroom = (gameCode) =>{
  return mapOfCurrentlyUsedGamerooms.get(gameCode) ;
} ;

const initMapOfCurrentlyUsedGamerooms = ()=>{
  mapOfCurrentlyUsedGamerooms = new Map() ;
} ;

const saveMapOfCurrentlyUsedGamerooms = ()=>{
  if(process.env.NODE_ENV == 'development'){
    let jsonObject = {};
    for(const [key,value] of mapOfCurrentlyUsedGamerooms.entries()){
      jsonObject[key] = value.toJSON() ;
    }
    fs.writeFileSync(__dirname + './../data/fake_db/gameroom_data.json', JSON.stringify(jsonObject)) ;

  }

} ;


const createRandomGameCode=()=>{
  let result = [];
  let characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';    // Base58 : removed I O l 0
  let charactersLength = characters.length;  //58
  for ( let i = 0; i < 6; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    // Math.random =                => returns a decimal number between 0 & 1             like  0.454689
    // Math.random() * 58           => any decimal number between 0 & 57.99               like  0.454689 * 58 = 26.371
    // Math.floor(5.6764)= 5        => so it returns an integer number between 0 & 57     like floor(26.371) = 26
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
  let newGameroom = new Gameroom(randomGameCode, (new Date()).getTime(), {p1 : firstPlayer}) ;
  mapOfCurrentlyUsedGamerooms.set(randomGameCode, newGameroom) ;
  saveMapOfCurrentlyUsedGamerooms() ;
  return newGameroom ;
} ;



const addSecondPlayerToGameroom = (gameCode, newPlayer, )=>{
  //firstly check if chatroom is not null
  let gameroom = mapOfCurrentlyUsedGamerooms.get(gameCode) ;
  if(gameroom == null) {
    console.log(`Err : You tried to add the user ${newPlayer.name} to game ${gameCode}, but no such gameCode exists `) ;
    return 'GAMECODE_INVALID' ; // chatroom does not exist
  }

  if(gameroom.players.p1  != null  && gameroom.players.p2 != null){
    // there are already 2  users in the game.
    console.log(`Err : Max User limit reached. Can't add more players to game ${gameCode}`) ;
    return 'USER_LIMIT_REACHED' ;
  }

  mapOfCurrentlyUsedGamerooms.get(gameCode).setPlayer('p2',  newPlayer) ;
  saveMapOfCurrentlyUsedGamerooms() ;
  return mapOfCurrentlyUsedGamerooms.get(gameCode) ;
} ;


const deleteGameroom = (gameCode)=>{
  mapOfCurrentlyUsedGamerooms.delete(gameCode) ;
  saveMapOfCurrentlyUsedGamerooms() ;
} ;




const setupGameroomAnswers = (gameCode, listOfQuestions)=>{
  let answerArray = [] ;
  listOfQuestions.forEach((questionJsonObject)=>{

    answerArray.push(questionJsonObject.correct_option) ;
  }) ;

  mapOfCurrentlyUsedGamerooms.get(gameCode).setupGameData(answerArray) ;
  saveMapOfCurrentlyUsedGamerooms() ;
} ;


const setup_AnswerGiven_byPlayer = (gameCode, questionNo, playerNo, selectedOption, timestamp)=>{
  mapOfCurrentlyUsedGamerooms.get(gameCode).addRoundScore(questionNo, playerNo, selectedOption, timestamp) ;
  saveMapOfCurrentlyUsedGamerooms() ;
} ;

const isAnswerGivenByBothPlayers = (gameCode, questionNo)=>{
  if(mapOfCurrentlyUsedGamerooms.get(gameCode).gameData[questionNo]['p1_selected_option'] != null &&
    mapOfCurrentlyUsedGamerooms.get(gameCode).gameData[questionNo]['p2_selected_option'] != null){
    return 2 ;
  }else{
    return 1 ;
  }
} ;



const updateRoundScore = (gameCode, questionNo)=>{
  let gameroom = mapOfCurrentlyUsedGamerooms.get(gameCode) ;
  let p1CurrentScore = gameroom.players.p1.score ;
  let p2CurrentScore = gameroom.players.p2.score ;

  let roundAnswerData = gameroom.gameData[questionNo] ;
  let correctOption = roundAnswerData.correct_option ;
  let p1SelectedOption = roundAnswerData.p1_selected_option ;
  let p2SelectedOption = roundAnswerData.p2_selected_option ;
  let p1Timestamp = roundAnswerData.p1_timestamp ;
  let p2Timestamp = roundAnswerData.p2_timestamp ;

  let is_p1Correct = p1SelectedOption == correctOption ;
  let is_p2Correct = p2SelectedOption == correctOption ;

  if(is_p1Correct){
    p1CurrentScore = p1CurrentScore + 2 ;
  }

  if(is_p2Correct){
    p2CurrentScore = p2CurrentScore + 2 ;
  }


  if(is_p1Correct && is_p2Correct){
    if(p1Timestamp < p2Timestamp){
      p1CurrentScore ++ ;
    }else{
      p2CurrentScore ++ ;
    }

  } else if(is_p1Correct && (p1Timestamp < p2Timestamp)){
    p1CurrentScore ++ ;
  } else if(is_p2Correct && (p2Timestamp < p1Timestamp)){
    p2CurrentScore ++ ;
  }



  if(!is_p1Correct && !is_p2Correct){
    //(both are not correct, so don't give any extra marks)
  }



  mapOfCurrentlyUsedGamerooms.get(gameCode).players.p1.score = p1CurrentScore ;
  mapOfCurrentlyUsedGamerooms.get(gameCode).players.p2.score = p2CurrentScore ;
  saveMapOfCurrentlyUsedGamerooms() ;

  return {
    p1_selected_option : p1SelectedOption,
    p2_selected_option : p2SelectedOption,
    correct_option : correctOption,
    p1_score : p1CurrentScore,
    p2_score : p2CurrentScore
  } ;

} ;



module.exports = {
  initMapOfCurrentlyUsedGamerooms,
  getGameroom,
  createNewGameroom,
  addSecondPlayerToGameroom,
  deleteGameroom,
  setupGameroomAnswers,
  setup_AnswerGiven_byPlayer,
  isAnswerGivenByBothPlayers,
  updateRoundScore
} ;