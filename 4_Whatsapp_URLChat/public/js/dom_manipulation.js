let currentChatroom = '' ; //variable to keep track of the currently used chatroom

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
  //TODO dont actually join the room here. we only join the room on clicking
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
                    <h5> ${chatroom.name}</h5>
                    <h6> ${chatroom.status}</h6>
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

  console.log(`clicked the room ${roomName} - ${roomStatus} - ${roomPath}`) ;
   //emit the event to join room here
  let newChatroom = new Chatroom(roomName, roomStatus, roomPath) ;
  //TODO we are creating  a new chatroom everytime we click on it, make sure we aren't creating a new one
  // use join chatroom here
  emitToServer_NewChatroomAdded(newChatroom, ()=>{
    console.log(`Successfully connected to the room ${roomName} - ${roomStatus} - ${roomPath}`) ;
    $('#chatHistory').html('') ;
    currentChatroom = newChatroom ;

  }) ;

}) ;





// setting the onClick listener when you press enter
$('#chatMessageSend').click(()=>{
  //TODO only send messages if user is connected to some room, currently messages are sent even if user isn't in chatroom
  // we need to keep track of client to see if he is in some chatroom. Simply use a variable
  if(currentChatroom == null || currentChatroom == ''){
    console.log("You are not connected to any chatroom") ;
    return ;
  }
  let chatMessage = $('#chatMessageValue').val() ;
  $('#chatMessageValue').val('') ; // clearing the text field

  let timestamp = (new Date()).getTime() ;
  let prettyTime = new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;


  // // firstly we append the message to chatHistory
  $('#chatHistory').append(
    `<div id="myMsg-${timestamp}" class="message sent">
    ${chatMessage}
    <span class="metadata">
      <span class="time">${prettyTime}</span>
      <span id="readReceipt" class="tick"><i class="far fa-clock fa-xs" style="color: grey"></i> </span>
    </span>
  </div>`) ;


  emitToServer_Message(chatMessage, timestamp, ()=>{
    document.querySelector(`#myMsg-${timestamp} #readReceipt`).innerHTML = `<i class="fas fa-check fa-xs" style="color: grey"></i>` ;
  }) ;




}) ;


function showMessageInChatHistory(sender, myUserName,  message, timestamp){
  let messageTime = (new Date(timestamp)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;


  // if message is sent by other people, simply show the message in chatHistory
  if(sender != myUserName){
    $('#chatHistory').append(
      `<div class="message received">
            <b>${sender} </b> <br> ${message}
        <span class="metadata">
            <span class="time">${messageTime}</span>
        </span>
      </div>`
    ) ;
  }
  // else if message is sent by client, show the double tick(indicating message is delivered)
  else {
    if(document.querySelector(`#myMsg-${timestamp}`) !== null){
      document.querySelector(`#myMsg-${timestamp} #readReceipt`).innerHTML = `<i class="fas fa-check-double fa-xs" style="color: grey"></i>` ;
    }


  }
}


