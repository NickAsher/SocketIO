const socket = io('http://localhost:4001') ;
let myUserName = localStorage.getItem('senderName') ;

socket.on('connect', ()=>{
  console.log(socket.id) ;
}) ;

socket.on('whatsapp_msg', (data)=>{

  let senderName = data.senderName ;
  let chatMessage = data.chatMessage ;
  let sentTimestamp = data.time ;
  let messageTime = (new Date(sentTimestamp)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;

  // if message is sent by client, show the double tick(indicating message is delivered)
  if(senderName == myUserName){
    if(document.querySelector(`#myMsg-${sentTimestamp}`) !== null){
      document.querySelector(`#myMsg-${sentTimestamp} #readReceipt`).innerHTML = `<i class="fas fa-check-double fa-xs" style="color: grey"></i>` ;
    }
  }
  // else if message is sent by other people, simply show the message in chatHistory
  else {
    $('#chatHistory').append(
      `<div class="message received">
            <b>${senderName} </b> <br> ${chatMessage}
        <span class="metadata">
            <span class="time">${messageTime}</span>
        </span>
      </div>`
    ) ;
  }
}) ;





// this event is triggered everytime a new user enters the chat.
// this is not triggered for us, when we, ourselves enter the chat
// socket.on('newUserEntered', (data)=> {
//   let newUserName = data.userName;
//
//   $('#chatHistory').append(
//     `<div class="message control">
//         ${newUserName} has entered the chat
//       </div>`
//   ) ;
// }) ;
  // you can't have disconnect messages without implementing some custom logic
  // because there is no event like socket.on('disconnect') on client side. This event is only on server side.
  // To Implement Disconnect messages, you have to track when the client leaves
  // using a map of socket-id's and client names, and see which socket id is disconnected from the server
  // and then send a disconnect emit from the server





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

function emitToServer_JoinChatroom(chatroomPath, newUserName, callbackFunction) {
  socket.emit('joinChatroom', {
    chatroomPath: chatroomPath,
    newUserName : newUserName
  }, (serverCallback)=>{
    if(serverCallback == true){
      callbackFunction() ;
    }
  }) ;
}

socket.on('joinChatroom', (data)=>{
  console.log("succesfully joined chatroom") ;
  console.log(data.chatroom) ;

  addChatRoomToLocalStorage(data.chatroom) ;
  updateListOfChatroom_in_DOM() ;

}) ;


socket.on('newUser_in_Chatroom', (data)=> {
  let newUserName = data.newUserName;

  $('#chatHistory').append(
    `<div class="message control">
        ${newUserName} has entered the chat
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




