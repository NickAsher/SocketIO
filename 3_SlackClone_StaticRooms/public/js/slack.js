const myUserName = localStorage.getItem('senderName') ;

const URL_ServerMainNamespace = 'http://localhost:4001' ;
let socket = io(URL_ServerMainNamespace + '/', {
  query : {
    userName : myUserName
  }
}) ;

//make socketNS a global variable, so that there is only namespace socket connection per client
// otherwise the client makes a new socketNamespace connection, everytime we click on a namespace
let socketNS = '' ;

socket.on('connect', (data)=>{

}) ;


socket.on('namespaceData', (namespaceData)=>{
  // update the ui with array of namespaces
  let div_ListOfNamespaces = document.querySelector('#div_ListOfNamespaces') ;
  div_ListOfNamespaces.innerHTML = '' ; // firstly, empty out the inner html
  namespaceData.forEach((ns)=>{
    div_ListOfNamespaces.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"><p>${ns.title}</p></div>` ;
  }) ;


  // add an onclick listener to each element, to join the namespace
  $('.namespace').each((index, nameSpaceElement)=>{
    $(nameSpaceElement).click(()=>{
      let namespaceEndpoint = $(nameSpaceElement).attr('ns') ;
      joinNamespace(namespaceEndpoint) ;
    }) ;
  }) ;
}) ;


function joinNamespace(namespaceEndpoint){
  //everytime this function is called i.e. everytime you join a namespace
  // a new socketNS is created i.e. a new socket connection is opened & a new event listener is added to btn_sendMessage
  // so we made the socketNS a global variable, and close any connections on it
  // and we remove the event listener too
  if(socketNS){
    socketNS.close() ;
    $('#btn_sendMessage').unbind('click') ;

  }
  socketNS = io(URL_ServerMainNamespace + namespaceEndpoint) ;
  // after connecting to the namespace, the server will send us an event roomData
  // this event 'roomData' will contain a list of rooms in that namespace
  socketNS.on('roomData', (roomData)=>{

    // update the DOM here and show the rooms
    let UL_RoomsList = document.querySelector('#UL_ListOfRooms') ;
    UL_RoomsList.innerHTML = '' ;
    roomData.forEach((room)=>{
      UL_RoomsList.innerHTML +=
        `<li class="room"><span class="glyphicon glyphicon-globe"></span>${room.roomTitle}</li>` ;
    }) ;

    // attach a click listener to each room
    $('.room').each((index, roomElement)=>{
      let roomTitle = $(roomElement).text() ;
      $(roomElement).click(()=>{
        joinRoom(socketNS, roomTitle) ;
        document.querySelector('#messages').innerHTML = '' ;
      });
    }) ;

  }) ;


  $('#btn_sendMessage').click(()=>{
    // event.preventDefault() ;
    let message = document.querySelector('#user-message').value ;
    document.querySelector('#user-message').value = '' ;  // clearing the input field
    socketNS.emit('textMessageToServer', {message : message, timestamp : (new Date).getTime() }) ;
  }) ;

  socketNS.on('textMessageFromServer', (textMessageData)=>{
    let message = textMessageData.message ;
    let time = textMessageData.time ;
    let senderName = textMessageData.senderName ;
    document.querySelector('#messages').innerHTML += `
                <li>
                    <div class="user-image">
                        <img src="https://via.placeholder.com/30" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${senderName} <span>${time}</span></div>
                        <div class="message-text">${message}</div>
                    </div>
                </li>
    ` ;

  }) ;
}


function joinRoom(socketNS, roomTitle){
  socketNS.emit('joinRoom', {roomTitle : roomTitle}) ;









}






