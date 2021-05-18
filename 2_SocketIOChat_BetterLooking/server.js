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
  cors: {origin: '*',}, // allow your webserver address here
  methods: ["GET", "POST"]
}) ;



io.on('connect', (socket, req)=>{

  console.log("a new client has been connected to our server") ;

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



}) ;


