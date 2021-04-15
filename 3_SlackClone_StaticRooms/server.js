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

  io.of(namespace.endpoint).on('connect', (socket, req)=>{
    console.log(`${socket.id} has joined ${namespace.endpoint}`) ;
  }) ;


}) ;

