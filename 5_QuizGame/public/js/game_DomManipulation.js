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


document.querySelector("#input_InviteGameCode").addEventListener("click", function(){
  let element = document.querySelector('#input_InviteGameCode') ;

  element.select(); /* Select the text field */
  element.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
  return false;
}, false);



document.querySelector("#input_JoinGameCode").addEventListener("click", async function(){
  const clipboardText = await navigator.clipboard.readText();
  document.querySelector("#input_JoinGameCode").value = clipboardText ;
  return false;
}, false);




localStorage.setItem('currentGameCode', '-1') ;
localStorage.setItem('playerNo', '-1') ;
let arrayOfQuestions = [] ;
let currentQuestion = 0 ;
let myScore = 0 ;


$('#btn_RequestGameCode').click(()=> {
  console.log("invite is clicked") ;
  emitToServer_RequestNewGame(()=>{
    //TODO maybe show some kind of loading bar here
  }) ;
}) ;

function onNewGameRequested(gameCode){
  localStorage.setItem('currentGameCode', gameCode) ;
  localStorage.setItem('playerNo', 'p1') ;
  $('#div_Player1Name').append(' (You)') ;
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
  localStorage.setItem('playerNo', 'p2') ;
  $('#div_Player2Name').append(' (You)') ;
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


function onUserDisconnected(){
  let myScore, opponentScore ;
  if(localStorage.getItem('playerNo') == 'p1'){
    myScore = $('#div_Player1Score').text() ;
    opponentScore = $('#div_Player2Score').text() ;
  }else{
    myScore = $('#div_Player2Score').text() ;
    opponentScore = $('#div_Player1Score').text() ;
  }
  $('#h5_DisconnectScore').text(`Your score is ${myScore} & your opponent Score is ${opponentScore}`) ;


  $('#modal_UserDisconnected').modal('show') ;
}

$('#btn_playerDisconnected, #btn_GameEnded').click(()=>{
  window.location.reload();
}) ;



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
  $('.my-badge-left').remove() ;
  $('.my-badge-right').remove() ;
  let question = arrayOfQuestions[questionNo] ;

  $('#div_QuestionStatement h4').text(question.question_statement) ;
  $('#div_AnswerOptionA h5').text(question.option_a) ;
  $('#div_AnswerOptionB h5').text(question.option_b) ;
  $('#div_AnswerOptionC h5').text(question.option_c) ;
  $('#div_AnswerOptionD h5').text(question.option_d) ;
}


function readyNextRound(){
  setTimeout(()=>{
    if(currentQuestion == 6){
      onGameEnded() ;
      return ;
    }
    currentQuestion++ ;
    showQuestion(currentQuestion) ;
  }, 500) ;
}



$('.my-answer-option').click((event)=>{
  let element = event.currentTarget ;
  let optionClicked = $(element).attr('data-option') ;

  //making the selected option yellow
  $(element).css({'background-image' : "url(images/question_rounded_yellow.png)" }) ;

  //adding a badge indicating that we selected this answer
  let myName = localStorage.getItem('playerNo') == 'p1' ? 'Player-1' : 'Player-2' ;
  $(element).parent().append(`<span class="badge badge-pill badge-dark my-badge-left">${myName}</span>`) ;

  let correctOption = arrayOfQuestions[currentQuestion].correct_option ;
  let isAnswerCorrect = optionClicked == correctOption ? true : false ;

  // TODO make the buttons unclickable now

  emitToServer_AnswerClicked(currentQuestion, optionClicked) ;

}) ;




function onAnswerGivenByBothPlayers(data){
  let p1SelectedOption = data.p1_selected_option ;
  let p2SelectedOption = data.p2_selected_option ;
  let correctOption = data.correct_option ;
  let p1Score = data.p1_score ;
  let p2Score = data.p2_score ;


  // color other player selected option with blue colour
  if(localStorage.getItem('playerNo') == 'p1'){

    let p2SelectedElement = $(`.my-answer-option[data-option='${p2SelectedOption}']`) ;
    p2SelectedElement.parent().append(`<span class="badge badge-pill badge-dark my-badge-right">Player-2</span>`) ;
    p2SelectedElement.css({'background-image' : "url(images/question_rounded_yellow.png)" }) ;

  }else if(localStorage.getItem('playerNo') == 'p2'){

    let p1SelectedElement = $(`.my-answer-option[data-option='${p1SelectedOption}']`) ;
    p1SelectedElement.parent().append(`<span class="badge badge-pill badge-dark my-badge-right">Player-1</span>`) ;
    p1SelectedElement.css({'background-image' : "url(images/question_rounded_yellow.png)" }) ;

  }


  setTimeout(()=>{
    $(`.my-answer-option[data-option='${correctOption}']`)
      .css({'background-image' : "url(images/question_rounded_green.png)" }) ;

    if(p1SelectedOption != correctOption){
      $(`.my-answer-option[data-option='${p1SelectedOption}']`)
        .css({'background-image' : "url(images/question_rounded_red.png)" }) ;
    }
    if(p2SelectedOption != correctOption){
      $(`.my-answer-option[data-option='${p2SelectedOption}']`)
        .css({'background-image' : "url(images/question_rounded_red.png)" }) ;
    }

    $('#div_Player1Score').text(p1Score) ;
    $('#div_Player2Score').text(p2Score) ;
    readyNextRound() ;
  }, 500) ;


}


function onGameEnded(){
  let myScore, opponentScore ;
  if(localStorage.getItem('playerNo') == 'p1'){
    myScore = $('#div_Player1Score').text() ;
    opponentScore = $('#div_Player2Score').text() ;
  }else{
    myScore = $('#div_Player2Score').text() ;
    opponentScore = $('#div_Player1Score').text() ;
  }
  $('#h5_GameEndedScore').text(`Your score is ${myScore} & your opponent Score is ${opponentScore}`) ;


  $('#modal_EndGame').modal('show') ;
}

