let currentChatroom = '' ; //variable to keep track of the currently used chatroom

document.addEventListener('DOMContentLoaded', ()=>{
  // this is run after the dom content is loaded
  updateListOfChatroom_in_DOM() ;
}) ;


$('#btn_AddNewChatroom').click(()=>{
  //TODO create random links for chatrooms
  let chatroomName = document.querySelector('#input_ChatroomName').value ;
  let chatroomStatus = document.querySelector('#input_ChatroomStatus').value ;

  //clear input fields
  document.querySelector('#input_ChatroomName').value = '' ;
  document.querySelector('#input_ChatroomStatus').value = '' ;

  emitToServer_RequestNewChatroom(chatroomName, chatroomStatus, ()=>{
    $('#modal_Loading').modal('show') ;
  }) ;


}) ;


function onChatroomAdded(newChatroom){
  setTimeout(()=>{
    $('#modal_Loading').modal('hide') ;
  }, 1000) ;


  addChatRoomToLocalStorage(newChatroom) ;
  updateListOfChatroom_in_DOM() ;
  highlightJoinedChatroom(newChatroom) ;


}





$('#btn_JoinChatroom').click(()=>{
  let chatroomPath = document.querySelector('#input_ChatroomLink').value ;

  document.querySelector('#input_ChatroomLink').value = '' ;
  emitToServer_JoinChatroom(chatroomPath, ()=>{
    $('#modal_Loading').modal('show') ;
  }) ;
}) ;


function onChatroomLinked(newChatroom){
  setTimeout(()=>{
    $('#modal_Loading').modal('hide') ;
  }, 1000) ;

  addChatRoomToLocalStorage(newChatroom) ;
  updateListOfChatroom_in_DOM(newChatroom) ;
  highlightJoinedChatroom(newChatroom) ;
}


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
            <div class="chatroom-container row no-margin-padding">
                    <div class="col-md-10 no-margin-padding">
                        <div id="room-${chatroom.path}" class="chatroom row " path="${chatroom.path}">
                            <img  src="https://picsum.photos/70/70" class="rounded-circle"  >
                            <div>
                                <h5> ${chatroom.name}</h5>
                                <h6> ${chatroom.status}</h6>
                            </div>

                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn_deleteRoom far fa-trash-alt" data-path="${chatroom.path}"></button>
                    </div>
                </div>
    ` ;
  }) ;
}

function deleteRoomFromLocalStorage(chatroomPath){
  if(localStorage.getItem('listOfChatrooms') == null || localStorage.getItem('listOfChatrooms') == ''){
    return ;
  }
  let listOfChatrooms = JSON.parse(localStorage.getItem('listOfChatrooms')) ;

  let newListOfChatrooms = listOfChatrooms.filter((chatroom)=>{
  // for each element, the boolean statement that returns 'true' will remain in the new array
    if(chatroom.path == chatroomPath){
      return false ;
    }else{
      return true ;
    }
  }) ;
  localStorage.setItem('listOfChatrooms', JSON.stringify(newListOfChatrooms)) ;
}


// $('.chatroom').click((..))  does not work for dynamic elements, use
// if you use arrow function in the callback of .on(), then $(this) will refer to the whole dom instead of element
// use event.target to get the element
$(document).on("click",".chatroom", (event)=>{

  let element =  event.currentTarget ; // $(this) only works if you don't use arrow function here
  $('.chatroom').removeClass('active') ; // remove the 'active' class from any other div with class 'chatroom'
  $(element).addClass('active') ;

  let roomName = $(element).find('h5').text() ;
  let roomStatus = $(element).find('h6').text() ;
  let roomPath = $(element).attr('path') ;
  let newChatroom = new Chatroom(roomName, roomStatus, roomPath) ;
  console.log(`clicked the room ${roomName} - ${roomStatus} - ${roomPath}`) ;

  emitNewUserInChatroom(roomPath, ()=>{
    console.log(`Successfully connected to the room ${roomName} - ${roomStatus} - ${roomPath}`) ;
    $('#chatHistory').html('') ;
    currentChatroom = newChatroom ;
  }) ;


}) ;


function highlightJoinedChatroom(chatroom){
  // this function is only called in 2 cases :
  //    when we first create a new room
  //    when we join a chatroom using the link

  let element = document.querySelector(`#room-${chatroom.path}`) ;

  $('.chatroom').removeClass('active') ; // remove the 'active' class from any other div with class 'chatroom'
  $(element).addClass('active') ;

  console.log(`Successfully connected to the room ${chatroom.name} - ${chatroom.status} - ${chatroom.path}`) ;
  currentChatroom = chatroom ;
}





// setting the onClick listener when you press enter
$('#chatMessageSend').click(()=>{

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
  let prettyTime = (new Date(timestamp)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;

  // if message is sent by other people, simply show the message in chatHistory
  if(sender != myUserName){
    $('#chatHistory').append(
      `<div class="message received">
            <b>${sender} </b> <br> ${message}
        <span class="metadata">
            <span class="time">${prettyTime}</span>
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


$(document).on('click', '.btn_deleteRoom', (event)=>{
  let element = event.currentTarget ;
  let chatroomPath = $(element).attr('data-path') ;



  // TODO send the emit event to server that u left this room
  emitToServer_UserLeftChatroom(chatroomPath, ()=>{
    deleteRoomFromLocalStorage(chatroomPath) ;
    updateListOfChatroom_in_DOM() ;
  }) ;


}) ;


async function createRandomURL(userName='Rafique', roomName='yolo'){
  let stringToEncode = `${userName} - ${roomName} - ${(new Date()).getTime()} - ${navigator.userAgent}`;
  console.log(stringToEncode) ;
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(`${stringToEncode}`);
    console.log(msgBuffer) ;
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    console.log(hashBuffer) ;

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    console.log(hashArray) ;
    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(36).padStart(2, '0')).join('');
    console.log(hashHex) ;

    // var base36 = parseInt(hashHex, 36)
    // return hashHex;

}
