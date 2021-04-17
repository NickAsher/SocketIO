import {Chatroom} from './classes/Chatroom.js' ;

$('#btn_AddNewChatroom').click(()=>{
  let chatroomName = document.querySelector('#input_ChatroomName').value ;
  let chatroomStatus = document.querySelector('#input_ChatroomStatus').value ;
  let chatroomImageLink = document.querySelector('#input_ChatroomImageLink').value ;
  let chatroomPath = document.querySelector('#input_ChatroomPath').value ;

  let newChatroom = new Chatroom(chatroomName, chatroomStatus, chatroomImageLink, chatroomPath) ;
  addChatRoomToLocalStorage(newChatroom.toJSON()) ;

  //clear input fields
  document.querySelector('#input_ChatroomName').value = '' ;
  document.querySelector('#input_ChatroomStatus').value = '' ;
  document.querySelector('#input_ChatroomImageLink').value  = '' ;
  document.querySelector('#input_ChatroomPath').value = '' ;

  updateListOfChatroom_in_DOM() ;


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
            <div class="chatroom row" data-path="${chatroom.path}">
                <img  src="${chatroom.img}" class="rounded-circle"  >
                <div>
                    <h5> &nbsp; ${chatroom.name}</h5>
                    <h6> ${chatroom.path}</h6>
                </div>
            </div>
            <hr>
    ` ;
  }) ;

}


