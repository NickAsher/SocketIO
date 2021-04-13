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

  console.log("a new client has been connected to our server") ;

  let TimeOfGreetingMessage = new Date() ;
  socket.emit('whatsapp_msg', {senderName:'Server', type : 'text', chatMessage:'Hey! Welcome here', time:TimeOfGreetingMessage}) ;


  socket.on('whatsapp_msg', (data)=>{

    socket.broadcast.emit('whatsapp_msg', {
      senderName : data.senderName,
      type:'text',
      chatMessage:data.chatMessage,
      time : data.time
    }) ;
  }) ;

}) ;


