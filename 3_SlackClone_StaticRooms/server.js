const express = require('express') ;
const socketio = require('socket.io') ;

const app = express() ;
app.use(express.static(__dirname + '/public')) ;

const expressServer = app.listen(4001, ()=>{
  console.log("Server is listening on port 4001") ;
}) ;

const io = socketio(expressServer, {
  cors: {origin: 'http://localhost:4001',}, // allow your webserver address here
  methods: ["GET", "POST"]
}) ;


let arrayOfNamespaces = require('./data/staticData') ;

// now after your setup which clients are authenticated into which namespaces,
// remember that each socket always firstly connect to the main Namespace i.e. '/'
// After it has connected to '/'    we will send the array of namespaces to the client.
// In ideal case, use some backend logic to see which namespaces, the client authenticated to use
io.on('connect', (socket, req)=>{
  let namespaceData = arrayOfNamespaces.map((namespace)=>{
    return {
      title : namespace.nsTitle,
      img : namespace.img,
      endpoint : namespace.endpoint
    } ;
  }) ;
  socket.emit('namespaceData', namespaceData) ;


}) ;



// we loop through each of the namespaces, looking for a connection
arrayOfNamespaces.forEach((namespace)=>{


  io.of(namespace.endpoint).on('connect', (socketNS, req)=>{
    console.log(socketNS.handshake) ;
    console.log(`${socketNS.id} has joined ${namespace.endpoint}  `) ;
    // after connecting to a namespace, we send that client, the list of rooms in that namespace
    socketNS.emit('roomData', namespace.arrayOfRooms) ;


    socketNS.on('joinRoom', (roomData)=>{

      // before we join a room, we must leave previous room
      // socketNs.rooms   is a set where 0th item is socketId and next items are currently joined rooms
      // but we can't jsut access Set items like array
      let previousRoomTitle = Array.from(socketNS.rooms)[1] ;
      socketNS.leave(previousRoomTitle) ;
      socketNS.join(roomData.roomTitle) ;
      console.log(socketNS.id + 'has joined the room' + roomData.roomTitle) ;
    }) ;


    socketNS.on('textMessageToServer', (textMessageData)=>{

      let messageData = textMessageData.message ;
      let time = new Date(textMessageData.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      let senderName = socketNS.handshake.query.userName ;

      let currentlyJoinedRoomTitle = Array.from(socketNS.rooms)[1] ;
      io.of(namespace.endpoint).to(currentlyJoinedRoomTitle).emit('textMessageFromServer', {
        message : messageData,
        time : time,
        senderName : senderName
      }) ;

    }) ;





  }) ;


}) ;

