class Gameroom{

  constructor(gameCode, creationTime, players=[] ){
    this.gameCode = gameCode;
    this.creationTime = creationTime ;
    this.players = players ;
    this.gameData = {'0': {}, '1' : {}, '2' : {}, '3' : {}, '4' : {}, '5' : {}, '6' : {}} ;
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


  setupGameData(answerArray){
    // assuming there are only 7 rounds in a game 0, 1, 2, 3, 4, 5, 6
    // you'll have something like this
    // {
    //   0 : {correct_option : 1},
    //   1 : {correct_option : 2},
    //   2 : {correct_option : 4},
    //   3 : {correct_option : 2},
    //   4 : {correct_option : 3},
    //   5 : {correct_option : 2},
    //   6 : {correct_option : 4},
    // }


    answerArray.forEach((answer, index)=>{
      this.gameData['' + index]['correct_option'] = answer ;
    }) ;

  }



  addRoundScore(roundNo, playerNo, selectedOption){
    let timestamp = new Date().getTime() ;
    if(playerNo == '1'){
      this.gameData['' + roundNo]['p1_timestamp'] = timestamp ;
      this.gameData['' + roundNo]['p1_selected_option'] = selectedOption ;
    }else{
      this.gameData['' + roundNo]['p2_timestamp'] = timestamp ;
      this.gameData['' + roundNo]['p2_selected_option'] = selectedOption ;
    }

  }


  toJSON(){
    return {
      gameCode : this.gameCode,
      creationTime : this.creationTime,
      players : this.players,
      gameData : this.gameData
    } ;
  }

}
module.exports = Gameroom ;