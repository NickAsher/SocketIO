class Gameroom{

  constructor(gameCode, creationTime, players={} ){
    this.gameCode = gameCode;
    this.creationTime = creationTime ;
    this.players = players ;
    this.gameData = {'0': {}, '1' : {}, '2' : {}, '3' : {}, '4' : {}, '5' : {}, '6' : {}} ;
  }


  setPlayer(playerNo, playerObj){
    this.players[playerNo] = playerObj ;
  }

  deletePlayer(playerSocketId){
    if(this.players.p1 != null && this.players.p1.socketId == playerSocketId){
      delete this.players.p1 ;
    }else if(this.players.p2 != null && this.players.p2.socketId == playerSocketId){
      delete this.players.p2 ;
    }
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



  addRoundScore(roundNo, playerNo, selectedOption, timestamp){
    if(playerNo == 'p1'){
      this.gameData['' + roundNo]['p1_timestamp'] = timestamp ;
      this.gameData['' + roundNo]['p1_selected_option'] = selectedOption ;
    }else if(playerNo == 'p2'){
      this.gameData['' + roundNo]['p2_timestamp'] = timestamp ;
      this.gameData['' + roundNo]['p2_selected_option'] = selectedOption ;
    }
  }

  calculateRoundScores(roundNo){
    //firstly update the scores if the player answer is correct




    // add the remaining 1 point for correct answer and answering first
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