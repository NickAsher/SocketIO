class Gameroom{

  constructor(gameCode, creationTime, players=[] ){
    this.gameCode = gameCode;
    this.creationTime = creationTime ;
    this.players = players ;
  }

  addPlayer(player){
    this.players.push(player) ;
  }

  removePlayer(playerToRemove_SocketId){
    this.players = this.players.filter((user)=>{
      // elements that return positive boolean remain in the new array
      return user.socketId != playerToRemove_SocketId ;
    }) ;

  }

  toJSON(){
    return {
      gameCode : this.gameCode,
      creationTime : this.creationTime,
      players : this.players
    } ;
  }

}
module.exports = Gameroom ;