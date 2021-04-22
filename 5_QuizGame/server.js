const express = require('express') ;
const socketio = require('socket.io') ;


const app = express() ;

app.use(express.static(__dirname + '/public')) ;

// we never did this before, but the app.listen function returns the server of express
// we need it here, because we are going to pass that to socket.io
const expressServer = app.listen(4001, ()=>{
  console.log("Server is listening on port 4001") ;
}) ;


const io = socketio(expressServer, {
  cors: {origin: 'http://localhost:4001',}, // allow your webserver address here
  methods: ["GET", "POST"]
}) ;


io.on('connect', (socket, req)=>{

  console.log(`a new client has been connected to our server ${socket.id} `) ;

  let TimeOfGreetingMessage = new Date() ;
  socket.emit('whatsapp_msg', {senderName:'Server', type : 'text', chatMessage:'Hey! Welcome here, welcome to our humble aboard', time:TimeOfGreetingMessage}) ;







  socket.on('C2S_RequestNewChatroom', (data, acknowledgement)=>{
    acknowledgement(true) ;


    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = data.path;
    socket.join(data.path);

    console.log(`${socket.id} (${data.sender}) has joined the room ${data.name} at path ${data.path}`) ;
    console.log(io.sockets.adapter.rooms.get(data.path)) ;


    //TODO emit back to client the new chatroom
    socket.emit('S2C_NewChatroomAdded', {
      newChatroom : data.toJSON()
    }) ;

  }) ;






  socket.on('joinChatroom', (data, acknowledgement)=>{
    acknowledgement(true) ;

    let chatroomPath = data.chatroomPath ;
    let newUserName = data.newUserName ;

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = chatroomPath;
    socket.join(chatroomPath);


    socket.emit('joinChatroom', {chatroom:data.toJSON()}) ;

    //inform other users that a new user has joined the chatroom
    socket.to(chatroomPath).emit('newUser_in_Chatroom', {
      newUserName :newUserName,
      timestamp : (new Date()).getTime()
    }) ;

    console.log(`${socket.id} (${data.newUserName}) has joined the room ${chatroomPath}`) ;
    console.log(io.sockets.adapter.rooms.get(chatroomPath)) ;
  }) ;




  socket.on('msg_in_Chatroom', (data, acknowledgement)=>{
    acknowledgement(true) ; // so i can do the single tick

    let roomPath = socket.room ;
    //send the message to everyone
    io.sockets.in(roomPath).emit('msg_in_Chatroom', {
      message :data.message,
      sender : data.sender,
      timestamp : data.timestamp
    }) ;
  }) ;

}) ;


