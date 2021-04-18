const express = require('express') ;
const socketio = require('socket.io') ;

const Chatroom = require("./data/classes/Chatroom_backend.js");

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

let listOfCurrentlyUsedChatrooms = new Map() ;

io.on('connect', (socket, req)=>{

  console.log(`a new client has been connected to our server ${socket.id} `) ;

  let TimeOfGreetingMessage = new Date() ;
  socket.emit('whatsapp_msg', {senderName:'Server', type : 'text', chatMessage:'Hey! Welcome here, welcome to our humble aboard', time:TimeOfGreetingMessage}) ;


  socket.on('whatsapp_msg', (data, fn)=>{


    fn(true) ; //telling the client that we got the message so that it can do first tick

    io.emit('whatsapp_msg', {
      senderName : data.senderName,
      type:'text',
      chatMessage:data.chatMessage,
      time : data.time
    }) ;
    // you need some type of custom logic for msg reads, can't just do that with acknowledgements
  }) ;

  socket.on('newUserEntered', (data)=>{
    socket.broadcast.emit('newUserEntered', {userName : data.userName, time:data.time}) ;
  }) ;



  socket.on('newChatroomAdded', (data, fn)=>{
    fn(true) ; //acknowledging to client that we received the event

    // join the client to a new namespace

    let newChatroom = new Chatroom(data.chatroom.name, data.chatroom.status, data.chatroom.path) ;
    newChatroom.addUser(data.sender) ;

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = newChatroom.path;
    socket.join(newChatroom.path);

    listOfCurrentlyUsedChatrooms.set(data.chatroom.path, newChatroom) ;
    console.log(`${socket.id} (${data.sender}) has joined the room ${newChatroom.name} at path ${newChatroom.path}`) ;
    console.log(io.sockets.adapter.rooms.get(newChatroom.path)) ;
  }) ;


  socket.on('joinChatroom', (data, acknowledgement)=>{
    acknowledgement(true) ;

    let chatroomPath = data.chatroomPath ;
    let newUserName = data.newUserName ;

    listOfCurrentlyUsedChatrooms.get(chatroomPath).addUser(data.newUserName) ;
    let chatroom = listOfCurrentlyUsedChatrooms.get(chatroomPath) ;

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = chatroomPath;
    socket.join(chatroomPath);

    socket.to(chatroomPath).emit('newUser_in_Chatroom', {
      newUserName :newUserName,
      timestamp : (new Date()).getTime()
    }) ;

    socket.emit('joinChatroom', {chatroom:chatroom.toJSON()}) ;



    console.log(`${socket.id} (${data.newUserName}) has joined the room `) ;
    console.log(io.sockets.adapter.rooms.get(chatroomPath)) ;
  }) ;



  socket.on('msg_in_Chatroom', (data, acknowledgement)=>{
    acknowledgement(true) ;
    console.log("i have got the msg_in_Chatroom")

    let roomPath = socket.room ;
    io.sockets.in(roomPath).emit('msg_in_Chatroom', {
      message :data.message,
      sender : data.sender,
      timestamp : data.timestamp
    }) ;
  }) ;

}) ;


