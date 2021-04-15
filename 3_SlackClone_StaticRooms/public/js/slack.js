let socket = io('http://localhost:4001/') ;
// let socketWiki = io('http://localhost:4001/wiki') ;
// let socketMozilla = io('http://localhost:4001/mozilla') ;
// let socketLinux = io('http://localhost:4001/linux') ;

let myUserName = localStorage.getItem('senderName') ;


socket.on('connect', (data)=>{

}) ;


socket.on('namespaceData', (namespaceData)=>{
  // update the ui with array of namespaces
  let div_ListOfNamespaces = document.querySelector('#div_ListOfNamespaces') ;
  div_ListOfNamespaces.innerHTML = '' ; // firstly, empty out the inner html
  namespaceData.forEach((ns)=>{
    div_ListOfNamespaces.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"><p>${ns.title}</p></div>` ;
  }) ;

  // add an onclick listener to each element

}) ;
