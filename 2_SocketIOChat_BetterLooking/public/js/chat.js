const socket = io('http://localhost:4001') ;
let myUserName = localStorage.getItem('senderName') ;

socket.on('connect', ()=>{
  console.log(socket.id) ;
}) ;

socket.on('whatsapp_msg', (data)=>{
  let senderName = data.senderName ;
  let chatMessage = data.chatMessage ;
  let messageTime = (new Date(data.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;

  $('#chatHistory').append(
`<div class="message received">
    <b>${senderName} </b> <br> ${chatMessage}
    <span class="metadata">
      <span class="time">${messageTime}</span>
    </span>
  </div>`) ;

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

function makeClickAppear(div_Id){


}