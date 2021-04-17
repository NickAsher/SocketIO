class Message{

  constructor(senderName, message){
    this.senderName = senderName ;
    this.message = message ;
    this.time = new Date().getTime() ;
  }


  toJSON(){
    return {senderName : this.senderName, message : this.message, timestamp : this.time} ;
  }


  static prettyTime(timestamp){
    return new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) ;
  }




}
module.exports = Message ;