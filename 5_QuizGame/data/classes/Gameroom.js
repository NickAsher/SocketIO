class Gameroom{

  constructor(gameCode, creationTime, players=[] ){
    this.gameCode = gameCode;
    this.creationTime = creationTime ;
    this.players = players ;
  }

  addPlayer(player){
    this.players.push(player) ;
  }

  removePlayer(playerToRemove){
    return this.players.filter((player)=>{
      // elements that return positive boolean remain in the new array
      return player != playerToRemove ;
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