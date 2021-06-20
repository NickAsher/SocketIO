const express = require('express') ;
const socketio = require('socket.io') ;
const GameroomUtils = require('./utils/GameroomUtils') ;
const QuestionUtils = require('./utils/QuestionUtils') ;
require('dotenv').config() ;

const app = express() ;

app.use(express.static(__dirname + '/public')) ;

// we never did this before, but the app.listen function returns the server of express
// we need it here, because we are going to pass that to socket.io
const expressServer = app.listen(4001, ()=>{
  console.log("Server is listening on port 4001") ;
}) ;

const io = socketio(expressServer, {
  cors: {
    origin: "https://www.inquiz.rafique.in", // allow your webserver address here
    methods: ["GET", "POST"],
    credentials : true
  }
}) ;



GameroomUtils.initMapOfCurrentlyUsedGamerooms() ;

io.on('connect', (socket, req)=>{

  let connectTime = new Date(new Date().getTime()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second : 'numeric', hour12: true }) ;
  console.log(`a new client has been connected to our server ${socket.id} at ${connectTime}`) ;




  socket.on('C2S_RequestNewGame', (data, acknowledgement)=>{
    acknowledgement(true) ;

    let newUser = {name : data.sender, socketId : socket.id, score : 0} ;
    let newGameroom = GameroomUtils.createNewGameroom(newUser) ;

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = newGameroom.gameCode;
    socket.join(newGameroom.gameCode);

    console.log(`${socket.id} (${data.sender}) has joined the gameCode ${newGameroom.gameCode}`) ;

    socket.emit('S2C_NewGameRequested', {
      gameroom : newGameroom
    }) ;

  }) ;

  socket.on('C2S_No2ndPlayerConnectedIn3Min', (data)=>{
    let gameCode = data.gameCode ;
    socket.leave(gameCode) ;
  }) ;


  socket.on('C2S_RequestJoinGame', async (data, acknowledgement)=>{
    acknowledgement(true) ;

    let newUser = {name : data.sender, socketId : socket.id, score : 0} ;
    let gameroom = GameroomUtils.addSecondPlayerToGameroom(data.gameCode, newUser) ;

    if(gameroom == 'USER_LIMIT_REACHED' || gameroom == 'GAMECODE_INVALID'){
      socket.emit('S2C_Error', {
        e : gameroom
      }) ;
      return ;
    }

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = gameroom.gameCode;
    socket.join(gameroom.gameCode);

    console.log(`${socket.id} (${data.sender}) has joined the gameCode ${gameroom.gameCode}`) ;


    let listOfQuestions = await QuestionUtils.get7RandomQuestions_DB() ;
    GameroomUtils.setupGameroomAnswers(gameroom.gameCode, listOfQuestions) ;

    socket.emit('S2C_NewGameJoined', {
      gameroom : gameroom.toJSON(),
      listOfQuestions : listOfQuestions
    }) ;

    //inform other users that a new user has joined the chatroom & send the questions list
    socket.to(gameroom.gameCode).emit('S2C_NewUserJoinedGame', {
      gameroom : gameroom,
      newUserName :data.sender,
      listOfQuestions : listOfQuestions
    }) ;




  }) ;



  socket.on('disconnect', async (data)=>{
    console.log("Disconnecr is called for " + socket.id) ;
    let gameCode = socket.room ;
    console.log(`The ${socket.id} is disconnecting `) ;
    if(gameCode == null){
      return ;
    }

    GameroomUtils.deleteGameroom(gameCode) ;
    io.sockets.in(gameCode).emit('userDisconnected') ;

    const roomSockets = await io.of("/").in(gameCode).fetchSockets();
    for(let singleSocket of roomSockets){
      singleSocket.leave(gameCode) ;
    }
  }) ;




  socket.on('gC2S_gameRoundAnswered', async (data)=>{
    let gameCode = socket.room ;
    let questionNo = data.questionNo ;
    let playerNo = data.playerNo ;
    let selectedOption = data.selectedOption ;
    let timestamp = new Date().getTime() ;

    GameroomUtils.setup_AnswerGiven_byPlayer(gameCode, questionNo, playerNo, selectedOption, timestamp) ;

    let prettyTime = new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second : 'numeric', hour12: true }) ;
    let msg = `Player ${playerNo} has answered Question No ${questionNo} at ${prettyTime}` ;
    io.sockets.in(gameCode).emit('gS2C_gameRoundAnswered', {
      msg : msg
    }) ;


    if(GameroomUtils.isAnswerGivenByBothPlayers(gameCode, questionNo) == 2){
      let roundData = GameroomUtils.updateRoundScore(gameCode, questionNo) ;
      io.sockets.in(gameCode).emit('gS2C_gameRoundAnsweredByBoth', roundData) ;


      if(questionNo == 6){
        // Game has ended, so delete the gameroom
        GameroomUtils.deleteGameroom(gameCode) ;
        const roomSockets = await io.of("/").in(gameCode).fetchSockets();
        for(let singleSocket of roomSockets){
          singleSocket.leave(gameCode) ;
        }
      }
    }



  }) ;





}) ;
