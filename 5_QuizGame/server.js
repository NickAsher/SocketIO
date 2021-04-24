const express = require('express') ;
const socketio = require('socket.io') ;
const GameroomUtils = require('./utils/GameroomUtils') ;


const app = express() ;

app.use(express.static(__dirname + '/public')) ;

// we never did this before, but the app.listen function returns the server of express
// we need it here, because we are going to pass that to socket.io
const expressServer = app.listen(4001, ()=>{
  console.log("Server is listening on port 4001") ;
}) ;


const io = socketio(expressServer, {
  cors: {origin: 'http://localhost:4001',}, // allow your webserver address here
  methods: ["GET", "POST"]
}) ;

GameroomUtils.initMapOfCurrentlyUsedGamerooms() ;

io.on('connect', (socket, req)=>{

  console.log(`a new client has been connected to our server ${socket.id} `) ;




  socket.on('C2S_RequestNewGame', (data, acknowledgement)=>{
    acknowledgement(true) ;

    let newGameroom = GameroomUtils.createNewGameroom(data.sender) ;

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = newGameroom.gameCode;
    socket.join(newGameroom.gameCode);

    console.log(`${socket.id} (${data.sender}) has joined the gameCode ${newGameroom.gameCode}`) ;

    socket.emit('S2C_NewGameStarted', {
      gameroom : newGameroom
    }) ;

  }) ;


  socket.on('C2S_JoinGame', (data, acknowledgement)=>{
    acknowledgement(true) ;

    let gameroom = GameroomUtils.addUserToChatroom(data.gameCode, data.sender) ;
    if(gameroom == 'USER_LIMIT_REACHED' || gameroom == 'GAMECODE_INVALID'){
      //TODO emit some kind of error event
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

    socket.emit('S2C_NewGameJoined', {
      gameroom : gameroom.toJSON()
    }) ;

    //inform other users that a new user has joined the chatroom
    socket.to(gameroom.gameCode).emit('S2C_NewUserJoinedGame', {
      gameroom : gameroom,
      newUserName :data.sender,
    }) ;


  }) ;












}) ;


