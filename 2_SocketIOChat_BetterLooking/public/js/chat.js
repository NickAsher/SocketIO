const socket = io('http://localhost:4001') ;
let myUserName = localStorage.getItem('senderName') ;

socket.on('connect', ()=>{
  console.log(socket.id) ;
  let sentTimestamp = new Date().getTime() ;
  socket.emit('newUserEntered', {userName : myUserName, time:sentTimestamp}) ;
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


// setting the onClick listener when you press enter
$('#chatMessageSend').click(()=>{
  let chatMessage = $('#chatMessageValue').val() ;
  $('#chatMessageValue').val('') ; // clearing the text field
  let sentTimestamp = new Date().getTime() ;
  let messageTime = new Date(sentTimestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;

  // firstly we append the message to chatHistory
  $('#chatHistory').append(
    `<div id="myMsg-${sentTimestamp}" class="message sent">
    ${chatMessage}
    <span class="metadata">
      <span class="time">${messageTime}</span>
      <span id="readReceipt" class="tick"><i class="far fa-clock fa-xs" style="color: grey"></i> </span> 
    </span>
  </div>`) ;

  // Now we emit the message to the server, so that it can send it to other clients
  socket.emit('whatsapp_msg',
    {senderName : myUserName, type: 'text', chatMessage : chatMessage, time:sentTimestamp},
    (confirmation)=>{
      // on Receiving acknowledgement from server that message was received,
      // show Single-Tick icon indicating message sent
      if(confirmation == true){
        document.querySelector(`#myMsg-${sentTimestamp} #readReceipt`).innerHTML = `<i class="fas fa-check fa-xs" style="color: grey"></i>` ;
      }
    }) ;
}) ;


// this event is triggered everytime a new user enters the chat.
// this is not triggered for us, when we, ourselves enter the chat
socket.on('newUserEntered', (data)=> {
  let newUserName = data.userName;

  $('#chatHistory').append(
    `<div class="message control">
        ${newUserName} has entered the chat
      </div>`
  ) ;
  // you can't have disconnect messages without implementing some custom logic
  // because there is no event like socket.on('disconnect') on client side. This event is only on server side.
  // To Implement Disconnect messages, you have to track when the client leaves
  // using a map of socket-id's and client names, and see which socket id is disconnected from the server
  // and then send a disconnect emit from the server


}) ;

