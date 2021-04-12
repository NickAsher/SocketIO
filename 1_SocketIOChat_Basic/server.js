const http = require('http') ;
const socketio = require('socket.io') ;

const server = http.createServer((req, res)=>{
  console.log("this is the backend_server on port 4000") ;
  res.end("this is the backend_server on port 4000");
}) ;

const io = socketio(server, {
  cors: {origin: '*',}, // allow your webserver address here
}) ;



io.on('connect', (socket, req)=>{

  console.log("a new client has been connected to our server") ;

  socket.emit('whatsapp_msg', {senderName:'Server', type : 'text', chatMessage:'Hey! Welcome here'}) ;


  socket.on('whatsapp_msg', (data)=>{
    io.emit('whatsapp_msg', {senderName : data.senderName, type:'text', chatMessage:data.chatMessage}) ;

  }) ;


}) ;

server.listen(4000) ;