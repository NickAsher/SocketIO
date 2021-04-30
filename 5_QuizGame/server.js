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

    socket.emit('S2C_NewGameStarted', {
      gameroom : newGameroom
    }) ;

  }) ;


  socket.on('C2S_JoinGame', async (data, acknowledgement)=>{
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


    //TODO send the list of 7 real random questions here
    let listOfQuestions = get7RandomQuestions() ;
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


const get7RandomQuestions = ()=>{
  return [{"correct_option":"3","option_a":"Virat Kohli","option_b":"V V S Laxman","option_c":"Ravindra Jadeja","question_statement":"Who is the first Indian cricketer to score 3 triple centuries in first class cricket?","option_d":"Virendar Sehwag","_ID":1,"recently_used":0},{"correct_option":"2","option_a":"Nitin Patil","option_b":"Bindeshwar Pathak","option_c":"Varsha Sharma","question_statement":"Who has been appointed as the brand ambassador of Swachh Rail Mission of Indian Railway?","option_d":"Nishant","_ID":2,"recently_used":0},{"correct_option":"2","option_a":"Begum Akhtar","option_b":"Wajid Ali Shah","option_c":"Amir Khusro","question_statement":"Who among the following wrote under the pen name Akhtar Piya ?","option_d":"Bahadur Shah Zafar","_ID":3,"recently_used":0},{"correct_option":"2","option_a":"America","option_b":"Iceland","option_c":"Ireland","question_statement":"Which country has topped the list of 2016 Global Gender Gap Report?","option_d":"New Zealand","_ID":4,"recently_used":0},{"correct_option":"3","option_a":"Election I-Card ","option_b":"Aadhar Card","option_c":"Passport","question_statement":"Which of these documents can be applied for under the tatkaal service in India?","option_d":"PAN Card","_ID":5,"recently_used":0},{"correct_option":"1","option_a":"Leander Paes","option_b":"Sania Mirza","option_c":"Rohan Bopanna","question_statement":"Which of these tennis players has won an Olympic medal for India ?","option_d":"Mahesh Bhupathi","_ID":6,"recently_used":0},{"correct_option":"3","option_a":"Richard Eaton","option_b":"Tarun Vijay","option_c":"Surendra Kumar","question_statement":"The book “Modi’s Midas Touch in Foreign Policy” has been authored by whom?","option_d":"Mahendra Jogi","_ID":7,"recently_used":0}] ;
} ;











