//TODO connect to a room, make sure both the users are connected to server, and get list of 15 questions on 'connect'
// const socket = io('http://localhost:4001') ;



//TODO do this inside when you get the 15 questions from  server
// socket.on('startGame', (data)=>{}) ;
let jsonArrayOfQuestions = [{"correct_option":"3","option_a":"Virat Kohli","option_b":"V V S Laxman","option_c":"Ravindra Jadeja","question_statement":"Who is the first Indian cricketer to score 3 triple centuries in first class cricket?","option_d":"Virendar Sehwag","_ID":1,"recently_used":0},{"correct_option":"2","option_a":"Nitin Patil","option_b":"Bindeshwar Pathak","option_c":"Varsha Sharma","question_statement":"Who has been appointed as the brand ambassador of Swachh Rail Mission of Indian Railway?","option_d":"Nishant","_ID":2,"recently_used":0},{"correct_option":"2","option_a":"Begum Akhtar","option_b":"Wajid Ali Shah","option_c":"Amir Khusro","question_statement":"Who among the following wrote under the pen name Akhtar Piya ?","option_d":"Bahadur Shah Zafar","_ID":3,"recently_used":0},{"correct_option":"2","option_a":"America","option_b":"Iceland","option_c":"Ireland","question_statement":"Which country has topped the list of 2016 Global Gender Gap Report?","option_d":"New Zealand","_ID":4,"recently_used":0},{"correct_option":"3","option_a":"Election I-Card ","option_b":"Aadhar Card","option_c":"Passport","question_statement":"Which of these documents can be applied for under the tatkaal service in India?","option_d":"PAN Card","_ID":5,"recently_used":0},{"correct_option":"1","option_a":"Leander Paes","option_b":"Sania Mirza","option_c":"Rohan Bopanna","question_statement":"Which of these tennis players has won an Olympic medal for India ?","option_d":"Mahesh Bhupathi","_ID":6,"recently_used":0},{"correct_option":"3","option_a":"Richard Eaton","option_b":"Tarun Vijay","option_c":"Surendra Kumar","question_statement":"The book “Modi’s Midas Touch in Foreign Policy” has been authored by whom?","option_d":"Mahendra Jogi","_ID":7,"recently_used":0},{"correct_option":"4","option_a":"Bajjika","option_b":"Magahi","option_c":"Bhojpuri","question_statement":"Which is the second most spoken language of Nepal ?","option_d":"Maithili","_ID":8,"recently_used":0},{"correct_option":"4","option_a":"ABCD","option_b":"BDCA","option_c":"CBDA","question_statement":"Starting with the closest, arrange these cities in increasing order of their distance from Kanyakumari ? A. Chennai B. Bhubaneswar C. Hyderabad D. Kolkata","option_d":"ACBD","_ID":9,"recently_used":0},{"correct_option":"1","option_a":"NDA","option_b":"NCP","option_c":"BSP","question_statement":"Which of these is not an abbreviation of a national political party in India ?","option_d":"CPI (M)","_ID":10,"recently_used":0},{"correct_option":"2","option_a":"ABCD","option_b":"BACD","option_c":"CBDA","question_statement":"Starting from the top, arrange these in the order in which they appear on Lord Shivas body.A. Third Eye B. The Moon C. Kundal D. Tiger Skin","option_d":"CBAD","_ID":11,"recently_used":0},{"correct_option":"4","option_a":"Mars","option_b":"Earth","option_c":"Venus","question_statement":"Which planet in our solar system takes the least amount of time to complete one revolution around the sun?","option_d":"Mercury","_ID":12,"recently_used":0},{"correct_option":"4","option_a":"Lion","option_b":"Elephant","option_c":"Bear","question_statement":"Gandhijis thought of See no evil, hear no evil, speak no evil is usually depicted by which animal?","option_d":"Monkey","_ID":13,"recently_used":0},{"correct_option":"2","option_a":"United States","option_b":"Australia","option_c":"France","question_statement":"“Confluence: Festival of India” the first-ever Indian music and dance festival has started in which country?","option_d":"Russia","_ID":14,"recently_used":0},{"correct_option":"1","option_a":"R Balki ","option_b":"Shyam Benegal","option_c":"Pradeep Sankar","question_statement":"Who directed Rajesh Khanna in his first ever TV commercial?","option_d":"Prahlad Kakkar","_ID":15,"recently_used":0}] ;
let arrayOfQuestions = [] ;
jsonArrayOfQuestions.forEach((jsonObject)=>{
  arrayOfQuestions.push(new Question(jsonObject)) ;
}) ;

let currentQuestion = 0 ;
let myScore = 0 ;





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



$('.my-answer-option').click((event)=>{

  let element = event.currentTarget ;
  let optionClicked = $(element).attr('data-option') ;

  //TODO emit the click event to server


  //making the selected option yellow
  $(element).css({'background-image' : "url(images/question_rounded_yellow.png)" }) ;

  // making the correct option green
  setTimeout(()=>{
    let correctOption = arrayOfQuestions[currentQuestion].correct_option ;

    $(`.my-answer-option[data-option='${correctOption}']`)
      .css({'background-image' : "url(images/question_rounded_green.png)" }) ;

    if(optionClicked == correctOption){
      myScore++ ;
      $('#div_YourScore').text(myScore) ;

      //TODO emit the score to server?? maybe


      setTimeout(()=>{
        readyNextRound() ;
      }, 500) ;
    }else{
      endGame(element);
    }
  }, 500) ;
}) ;


function readyNextRound(){
  currentQuestion++ ;
  showQuestion(currentQuestion) ;
}


function endGame(lastClickedElement){
  $(lastClickedElement).css({'background-image' : "url(images/question_rounded_red.png)" }) ;
  console.log("Game has ended, and your total score is " + myScore) ;

}




showQuestion(currentQuestion) ;