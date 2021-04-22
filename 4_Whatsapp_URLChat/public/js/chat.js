const socket = io('http://localhost:4001') ;
let myUserName = localStorage.getItem('senderName') ;

socket.on('connect', ()=>{
  console.log(socket.id) ;
}) ;







function emitToServer_RequestNewChatroom(chatroomName, chatroomStatus, DOMCallbackFunction){
  socket.emit('C2S_RequestNewChatroom', {
    chatroomName : chatroomName,
    chatroomStatus : chatroomStatus,
    sender : myUserName
  }, (serverCallback)=>{
    if(serverCallback == true){
      DOMCallbackFunction() ;
    }
  }) ;
}


socket.on('S2C_NewChatroomAdded', (data)=>{
  let newChatroom = data.newChatroom ;
  console.log('E: S2C_NewChatroomAdded, New chatroom added') ;


  onChatroomAdded(newChatroom) ;



}) ;


function emitToServer_NewChatroomAdded(newChatroom, callbackFunction){

  socket.emit('newChatroomAdded', {
    chatroom: newChatroom.toJSON(),
    timestamp : (new Date()).getTime(),
    sender : myUserName
  }, (serverCallback)=>{
    if(serverCallback == true){
      callbackFunction() ;
    }
  }) ;
}

function emitToServer_JoinChatroom(chatroomPath, callbackFunction) {
  socket.emit('joinChatroom', {
    chatroomPath: chatroomPath,
    newUserName : myUserName
  }, (serverCallback)=>{
    if(serverCallback == true){
      callbackFunction() ;
    }
  }) ;
}

socket.on('joinChatroom', (data)=>{
  console.log("succesfully joined chatroom") ;
  console.log(data.chatroom) ;

  onChatroomLinked(data.chatroom) ;


}) ;


function emitNewUserInChatroom(chatroomPath, DOMCallbackFunction){
  socket.emit('newUser_in_Chatroom', {
    chatroomPath : chatroomPath,
    newUserName : myUserName
  }, (serverAcknowledgement)=>{
    if(serverAcknowledgement == true){
      DOMCallbackFunction() ;
    }
  }) ;
}


socket.on('newUser_in_Chatroom', (data)=> {
  let newUserName = data.newUserName;

  $('#chatHistory').append(
    `<div class="message control">
        ${newUserName} has entered the chat
      </div>`
  );
  // you can't have disconnect messages without implementing some custom logic
  // because there is no event like socket.on('disconnect') on client side. This event is only on server side.
  // To Implement Disconnect messages, you have to track when the client leaves
  // using a map of socket-id's and client names, and see which socket id is disconnected from the server
  // and then send a disconnect emit from the server



}) ;


function emitToServer_UserLeftChatroom(chatroomPath, DOMCallbackFunction){
  socket.emit('userLeftChatroom', {
    chatroomPath : chatroomPath,
    userName : myUserName,
    timestamp : (new Date()).getTime()
  }, (serverAcknowledgement)=>{
    if(serverAcknowledgement == true){
      DOMCallbackFunction() ;
    }
  }) ;
}

socket.on('userLeftChatroom', (data)=>{
  //Todo inform everone that user left chatroom

  let userName = data.userName;

  $('#chatHistory').append(
    `<br>
      <div class="message control">
        ${userName} has left the chatroom
      </div>`
  );
}) ;



function emitToServer_Message(message, timestamp, callbackFunction){

  socket.emit('msg_in_Chatroom', {
    message : message,
    sender : myUserName,
    timestamp : timestamp
  }, (serverCallback)=>{
    if(serverCallback == true){
      callbackFunction() ;
    }
  }) ;
}



socket.on('msg_in_Chatroom', (data)=>{
  showMessageInChatHistory(data.sender, myUserName, data.message, data.timestamp) ;
}) ;




