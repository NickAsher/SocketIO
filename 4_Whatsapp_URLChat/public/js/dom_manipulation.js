document.addEventListener('DOMContentLoaded', ()=>{
  // this is run after the dom content is loaded
  updateListOfChatroom_in_DOM() ;
}) ;


$('#btn_AddNewChatroom').click(()=>{
  let chatroomName = document.querySelector('#input_ChatroomName').value ;
  let chatroomStatus = document.querySelector('#input_ChatroomStatus').value ;
  let chatroomPath = document.querySelector('#input_ChatroomPath').value ;


  let newChatroom = new Chatroom(chatroomName, chatroomStatus, chatroomPath) ;

  //clear input fields
  document.querySelector('#input_ChatroomName').value = '' ;
  document.querySelector('#input_ChatroomStatus').value = '' ;
  document.querySelector('#input_ChatroomPath').value = '' ;

  emitToServer_NewChatroomAdded(newChatroom, ()=>{
    addChatRoomToLocalStorage(newChatroom.toJSON()) ;
    updateListOfChatroom_in_DOM() ;
  }) ;


}) ;

document.querySelector('#btn_JoinChatroom').addEventListener('click', (event)=>{
  let element = event.target ;
  let chatroomPath = document.querySelector('#input_ChatroomLink').value ;

  document.querySelector('#input_ChatroomLink').value = '' ;
  emitToServer_JoinChatroom(chatroomPath, myUserName, ()=>{

  }) ;

}) ;


function addChatRoomToLocalStorage(chatroom){
  if(localStorage.getItem('listOfChatrooms') == null || localStorage.getItem('listOfChatrooms') == ''){
    localStorage.setItem('listOfChatrooms', JSON.stringify([])) ;
  }

  let listOfChatrooms = JSON.parse(localStorage.getItem('listOfChatrooms')) ;
  listOfChatrooms.push(chatroom) ;
  localStorage.setItem('listOfChatrooms', JSON.stringify(listOfChatrooms)) ;
}

function updateListOfChatroom_in_DOM(){
  if(localStorage.getItem('listOfChatrooms') == null || localStorage.getItem('listOfChatrooms') == ''){
    localStorage.setItem('listOfChatrooms', JSON.stringify([])) ;
  }
  let listOfChatrooms = JSON.parse(localStorage.getItem('listOfChatrooms')) ;

  document.querySelector('#div_ListOfChatrooms').innerHTML = '' ;
  listOfChatrooms.forEach((chatroom)=>{
    document.querySelector('#div_ListOfChatrooms').innerHTML += `
            <div class="chatroom row" path="${chatroom.path}">
                <img  src="https://picsum.photos/70/70" class="rounded-circle"  >
                <div>
                    <h5> &nbsp; ${chatroom.name}</h5>
                    <h6> ${chatroom.path}</h6>
                </div>
            </div>
            <hr>
    ` ;
  }) ;
}


// $('.chatroom').click((..))  does not work for dynamic elements
// if you use arrow function in the callback of .on(), then $(this) will refer to the whole dom instead of element
// use event.target to get the element
$(document).on("click",".chatroom", (event)=>{

  let element = event.target ; // $(this) only works if you don't use arrow function here
   $('.chatroom').removeClass('active') ;
   $(element).addClass('active') ;

   let roomName = $(element).find('h5').text() ;
   let roomStatus = $(element).find('h6').text() ;
  let roomPath = $(element).attr('path') ;

   console.log(`clicked the room ${roomName} - ${roomPath} - ${roomPath}`) ;
   //emit the event to join room here
  let newChatroom = new Chatroom(roomName, roomStatus, roomPath)
  emitToServer_NewChatroomAdded(newChatroom, ()=>{
    console.log("succesfully connected to chatroom") ;
  }) ;

}) ;





// setting the onClick listener when you press enter
$('#chatMessageSend').click(()=>{
  let chatMessage = $('#chatMessageValue').val() ;
  $('#chatMessageValue').val('') ; // clearing the text field
  let sentTimestamp = new Date().getTime() ;
  // let messageTime = new Date(sentTimestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;

  // // firstly we append the message to chatHistory
  // $('#chatHistory').append(
  //   `<div id="myMsg-${sentTimestamp}" class="message sent">
  //   ${chatMessage}
  //   <span class="metadata">
  //     <span class="time">${messageTime}</span>
  //     <span id="readReceipt" class="tick"><i class="far fa-clock fa-xs" style="color: grey"></i> </span>
  //   </span>
  // </div>`) ;



  // Now we emit the message to the server, so that it can send it to other clients
  socket.emit('msg_in_Chatroom',
    {sender : myUserName, message : chatMessage, time:sentTimestamp},
    (confirmation)=>{
      // on Receiving acknowledgement, show Single-Tick icon indicating message sent
      if(confirmation == true){
        // document.querySelector(`#myMsg-${sentTimestamp} #readReceipt`).innerHTML = `<i class="fas fa-check fa-xs" style="color: grey"></i>` ;
      }
    }) ;
}) ;


