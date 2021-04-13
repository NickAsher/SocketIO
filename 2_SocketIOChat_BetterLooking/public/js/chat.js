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



  if(senderName == myUserName){
    if(document.querySelector(`#myMsg-${sentTimestamp}`) !== null){
      // this message is the one, sent by this client
      // so we don't append anything, but rather just show the 2 tick (i.e. message delivered)
      document.querySelector(`#myMsg-${sentTimestamp} #readReceipt`).innerHTML = `<i class="fas fa-check-double fa-xs" style="color: grey"></i>` ;

    }

  } else {
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



$('#chatMessageSend').click(()=>{
  let chatMessage = $('#chatMessageValue').val() ;
  $('#chatMessageValue').val('') ; // clearing the text field
  let sentTimestamp = new Date().getTime() ;
  let messageTime = new Date(sentTimestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;

  $('#chatHistory').append(
    `<div id="myMsg-${sentTimestamp}" class="message sent">
    ${chatMessage}
    <span class="metadata">
      <span class="time">${messageTime}</span>
      <span id="readReceipt" class="tick"><i class="far fa-clock fa-xs" style="color: grey"></i> </span> 
    </span>
  </div>`) ;

  socket.emit('whatsapp_msg',
    {senderName : myUserName, type: 'text', chatMessage : chatMessage, time:sentTimestamp},
    (confirmation)=>{
    // this is confirmation that the message was received by the server
      if(confirmation == true){
        // Adding a tick icon for a sent message
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
  // basically you would have to track when the client leaves, you emit a message
  // to do this you basically have to make a map of socket-id's and their names
  // and see which socket id is disconnected from the server


}) ;

