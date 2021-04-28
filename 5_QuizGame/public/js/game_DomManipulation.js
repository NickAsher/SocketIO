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
localStorage.setItem('playerNo', '-1') ;
let arrayOfQuestions = [] ;
let currentQuestion = 0 ;
let myScore = 0 ;


$('#btn_RequestGameCode').click(()=> {
  emitToServer_RequestNewGame(()=>{
    //TODO maybe show some kind of loading bar here
  }) ;
}) ;

function onNewGameRequested(gameCode){
  localStorage.setItem('currentGameCode', gameCode) ;
  localStorage.setItem('playerNo', 1) ;
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

function onGameJoined(gameCode, listOfQuestions){
  localStorage.setItem('currentGameCode', gameCode) ;
  localStorage.setItem('playerNo', 2) ;
  showOriginalModal = false ;
  startGame(listOfQuestions) ;
}


function onNewUserJoiningTheGame(gameCode, newUserName, listOfQuestions){
  $('#progressBar_Player2').removeClass('bg-danger') ;
  $('#progressBar_Player2').addClass('bg-success') ;

  localStorage.setItem('currentGameCode', gameCode) ;
  showOriginalModal = false ;
  $('#modal_ShowGameCode').modal('hide') ;
    startGame(listOfQuestions) ;

}


function showErrorToUser(errorMsg){
  // TODO show user, the error msg in something like a dialog box or an alert
}


//TODO tell the other user that user has disconnected



/* *********************************** Game Logic ************************************************/

function startGame(listOfQuestions){
  arrayOfQuestions = [] ;
  listOfQuestions.forEach((jsonObject)=>{
    arrayOfQuestions.push(new Question(jsonObject)) ;
  }) ;
  showQuestion(0) ;

}


function showQuestion(questionNo){
  //reset all answer backgrounds
  $('.my-answer-option').css({'background-image' : "url(images/question_rounded_darkwine.png)" }) ;
  let question = arrayOfQuestions[questionNo] ;

  $('#div_QuestionStatement h4').text(question.question_statement) ;
  $('#div_AnswerOptionA h5').text(question.option_a) ;
  $('#div_AnswerOptionB h5').text(question.option_b) ;
  $('#div_AnswerOptionC h5').text(question.option_c) ;
  $('#div_AnswerOptionD h5').text(question.option_d) ;
}


function readyNextRound(){
  setTimeout(()=>{
    currentQuestion++ ;
    showQuestion(currentQuestion) ;
  }, 500) ;
}



$('.my-answer-option').click((event)=>{

  let element = event.currentTarget ;
  let optionClicked = $(element).attr('data-option') ;

  //TODO emit the click event to server


  //making the selected option yellow
  $(element).css({'background-image' : "url(images/question_rounded_yellow.png)" }) ;



  let correctOption = arrayOfQuestions[currentQuestion].correct_option ;
  let isAnswerCorrect = optionClicked == correctOption ? true : false ;


  emitToServer_AnswerClicked(currentQuestion, optionClicked) ;

  // making the correct option green
  // setTimeout(()=>{
  //
  //   $(`.my-answer-option[data-option='${correctOption}']`)
  //     .css({'background-image' : "url(images/question_rounded_green.png)" }) ;
  //
  //   if(optionClicked == correctOption){
  //     myScore = myScore + 2 ;
  //     $('#div_YourScore').text(myScore) ;
  //   }else{
  //     $(element).css({'background-image' : "url(images/question_rounded_red.png)" }) ;
  //   }
  //   //TODO emit the score to server?? maybe
  //   readyNextRound() ;
  //
  // }, 500) ;
}) ;


function onServerResponse_QuestionClicked(data){
  let mySelectedOption = data.mySelectedOption ;
  let player2SelectedOption = data.player2SelectedOption ;

  let correctOption = data.correctOption ;


  //highlight my selected option
  // highlight player2Selected option

  //highlight correctoption by green colour
  $(`.my-answer-option[data-option='${correctOption}']`)
    .css({'background-image' : "url(images/question_rounded_green.png)" }) ;

  let whoAnsweredFirst = data.whoAnsweredFirst ;

  let myNewScore = data.MyNewScore ;
  let player2NewScore = data.player2NewScore ;

  //update the scores.

  readyNextRound() ;
}

