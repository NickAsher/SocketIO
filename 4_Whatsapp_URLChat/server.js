const express = require('express') ;
const socketio = require('socket.io') ;

const Chatroom = require("./data/classes/Chatroom_backend.js");
const ChatroomUtils = require('./util/ChatroomUtils') ;
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

ChatroomUtils.init_ListOfCurrentlyUsedChatrooms() ;

io.on('connect', (socket, req)=>{

  console.log(`a new client has been connected to our server ${socket.id} `) ;

  let TimeOfGreetingMessage = new Date() ;
  socket.emit('whatsapp_msg', {senderName:'Server', type : 'text', chatMessage:'Hey! Welcome here, welcome to our humble aboard', time:TimeOfGreetingMessage}) ;




  socket.on('newChatroomAdded', (data, acknowledgement)=>{
    acknowledgement(true) ;

    // join the client to a new namespace
    let newChatroom = ChatroomUtils.createNewChatroom(data.chatroom.name, data.chatroom.status, data.chatroom.path) ;
    ChatroomUtils.addUserToChatroom(data.chatroom.path, data.sender) ;

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = newChatroom.path;
    socket.join(newChatroom.path);

    console.log(`${socket.id} (${data.sender}) has joined the room ${newChatroom.name} at path ${newChatroom.path}`) ;
    console.log(io.sockets.adapter.rooms.get(newChatroom.path)) ;
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

    ChatroomUtils.addUserToChatroom(chatroomPath, data.newUserName) ; //this line won't work on fresh server restart if the chatroom is not added in the same session
    let chatroom = ChatroomUtils.getChatroomByPath(chatroomPath) ;
    socket.emit('joinChatroom', {chatroom:chatroom.toJSON()}) ;

    //inform other users that a new user has joined the chatroom
    socket.to(chatroomPath).emit('newUser_in_Chatroom', {
      newUserName :newUserName,
      timestamp : (new Date()).getTime()
    }) ;

    console.log(`${socket.id} (${data.newUserName}) has joined the room ${chatroomPath}`) ;
    console.log(io.sockets.adapter.rooms.get(chatroomPath)) ;
  }) ;



  socket.on('newUser_in_Chatroom', (data, acknowledgement)=>{
    acknowledgement(true);
    // connect the user to this chatroom

    // listOfCurrentlyUsedChatrooms.get(path).addUser(user)  is not useful here because
    // the userArray in chatroom object is like the users in a whatsapp group
    // we track of which users are in the group. We don't keep track of which users are currently online

    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = data.chatroomPath;
    socket.join(data.chatroomPath);

    //inform all other users that a new user has joined the chatroom
    socket.to(data.chatroomPath).emit('newUser_in_Chatroom', {
      newUserName :data.newUserName,
      timestamp : (new Date()).getTime()
    }) ;

    console.log(`${socket.id} (${data.newUserName}) has joined the room ${data.chatroomPath}`) ;
    console.log(io.sockets.adapter.rooms.get(data.chatroomPath)) ;
  }) ;



  socket.on('msg_in_Chatroom', (data, acknowledgement)=>{
    acknowledgement(true) ; // so i can do the single tick

    let roomPath = socket.room ;
    io.sockets.in(roomPath).emit('msg_in_Chatroom', {
      message :data.message,
      sender : data.sender,
      timestamp : data.timestamp
    }) ;
  }) ;

}) ;


