const socket = io('http://localhost:4001') ;


function emitToServer_RequestNewGame(DOMCallbackFunction){
  socket.emit('C2S_RequestNewGame', {
    sender: localStorage.getItem('senderName')
  }, (serverAcknowledgement) => {
    if (serverAcknowledgement == true) {
      DOMCallbackFunction();
    }
  });
}

socket.on('S2C_NewGameStarted', (data)=>{
  let gameCode = data.gameroom.gameCode ;
  console.log("Gamecode is " + gameCode) ;
  onNewGameRequested(gameCode) ;
}) ;


function emitToServer_JoinGame(gameCode, DOMCallbackFunction){
  socket.emit('C2S_JoinGame', {
    gameCode : gameCode,
    sender : localStorage.getItem('senderName')
  }, (serverAcknowledgement)=>{
    if(serverAcknowledgement){
      DOMCallbackFunction() ;
    }
  }) ;
}

socket.on('S2C_NewGameJoined', (data)=>{
  let gameCode = data.gameroom.gameCode ;
  console.log("Gamecode is " + gameCode) ;
  onGameJoined(gameCode) ;
}) ;


socket.on('S2C_NewUserJoinedGame', (data)=>{
  console.log(`new User has joined the game ${data.gameroom.gameCode} ${data.newUserName}`) ;
  onNewUserJoiningTheGame(data.gameroom.gameCode, data.newUserName) ;
}) ;


socket.on('S2C_Error', (data)=>{
  console.log('error : ' + data.e) ;
  showErrorToUser(data.e) ;
}) ;