//this boolean is used to track whether we want to show the original modal or not
// when modal_JoinNewGame or modal_ShowGameCode are closed
// set this boolean to false, when you have started playing the game
let showOriginalModal = true ;

// show the opening modal, when page is completely loaded
$(window).on('load', ()=>{
  $('#modal_Opening').modal('show') ;
}) ;


//show the original modal when user closes the joinGame modal, but doesn't actually join the game
$('#modal_JoinNewGame').on('hidden.bs.modal', function () {
  if(showOriginalModal){
    $('#modal_Opening').modal('show') ;
  }
}) ;

//show the original modal when user closes the showGameCode modal, but doesn't actually join the game
$('#modal_ShowGameCode').on('hidden.bs.modal', function () {
  if(showOriginalModal){
    $('#modal_Opening').modal('show') ;
  }
}) ;


localStorage.setItem('currentGameCode', '-1') ;


$('#btn_RequestGameCode').click(()=> {
  emitToServer_RequestNewGame(()=>{
    //TODO maybe show some kind of loading bar here
  }) ;
}) ;

function onNewGameRequested(gameCode){
  document.querySelector('#input_InviteGameCode').value = gameCode ;
  $('#modal_ShowGameCode').modal('show') ;
}





$('#btn_JoinGame').click(()=>{
  let gameCode = document.querySelector('#input_JoinGameCode').value ;
  if(gameCode == null || gameCode == ''){
    console.log('Please enter a game code') ;
    return ;
  }
  emitToServer_JoinGame(gameCode, ()=>{
    // TODO show a loading bar here
  }) ;

}) ;

function onGameJoined(gameCode){
  localStorage.setItem('currentGameCode', gameCode) ;
  //TODO play the game now
}


function onNewUserJoiningTheGame(gameCode, newUserName){
  $('#progressBar_Player2').removeClass('bg-danger') ;
  $('#progressBar_Player2').addClass('bg-success') ;

    localStorage.setItem('currentGameCode', gameCode) ;
    //TODO play the game now

}


function showErrorToUser(errorMsg){
  // TODO show user, the error msg in something like a dialog box or an alert
}


function startGame(){
  //this function will be attached to the click listener of btn_PlayGame when two players will join the gameroom
}


//TODO remove the user on disconnect