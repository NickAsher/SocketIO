const fs = require('fs') ;
const AWS = require('aws-sdk') ;

AWS.config.loadFromPath(__dirname + './../secret/aws_credentials.json');
let docClient = new AWS.DynamoDB.DocumentClient() ;


const generate7RandomNumbers = (minimumNo, maximumNo)=>{
  let returnArray = [] ;

  while (returnArray.length != 7){
    let randomDecimal = minimumNo  + (Math.random() * (maximumNo - minimumNo + 1))  ;
    let randomNo = Math.floor(randomDecimal) ;
    if(!returnArray.includes(randomNo)){
      returnArray.push(randomNo) ;
    }
  }

  return returnArray ;
} ;


const get7RandomQuestions_DB = async ()=>{
  let returnArray = [] ;

  let questionIdArray = generate7RandomNumbers(1, 3976) ; // list of random question id's

  let params = {
    RequestItems : {
      "Questions" : {
        Keys : [
          { _ID : questionIdArray[0] },
          { _ID : questionIdArray[1] },
          { _ID : questionIdArray[2] },
          { _ID : questionIdArray[3] },
          { _ID : questionIdArray[4] },
          { _ID : questionIdArray[5] },
          { _ID : questionIdArray[6] }
        ]
      },

    }
  } ;

  try{
    const data  = await docClient.batchGet(params).promise() ;
    return data.Responses.Questions ;
  }catch (e) {
    console.log(e) ;
    return null ;
  }

} ;

// (async ()=>{

//   let questions = await get7RandomQuestions_DB() ;   // there is no such thing as top level await in nodejs
//   console.log(JSON.stringify(questions, null, 2)) ;
// })() ;


const get7RandomQuestions = ()=>{
  return [{"correct_option":"3","option_a":"Virat Kohli","option_b":"V V S Laxman","option_c":"Ravindra Jadeja","question_statement":"Who is the first Indian cricketer to score 3 triple centuries in first class cricket?","option_d":"Virendar Sehwag","_ID":1,"recently_used":0},{"correct_option":"2","option_a":"Nitin Patil","option_b":"Bindeshwar Pathak","option_c":"Varsha Sharma","question_statement":"Who has been appointed as the brand ambassador of Swachh Rail Mission of Indian Railway?","option_d":"Nishant","_ID":2,"recently_used":0},{"correct_option":"2","option_a":"Begum Akhtar","option_b":"Wajid Ali Shah","option_c":"Amir Khusro","question_statement":"Who among the following wrote under the pen name Akhtar Piya ?","option_d":"Bahadur Shah Zafar","_ID":3,"recently_used":0},{"correct_option":"2","option_a":"America","option_b":"Iceland","option_c":"Ireland","question_statement":"Which country has topped the list of 2016 Global Gender Gap Report?","option_d":"New Zealand","_ID":4,"recently_used":0},{"correct_option":"3","option_a":"Election I-Card ","option_b":"Aadhar Card","option_c":"Passport","question_statement":"Which of these documents can be applied for under the tatkaal service in India?","option_d":"PAN Card","_ID":5,"recently_used":0},{"correct_option":"1","option_a":"Leander Paes","option_b":"Sania Mirza","option_c":"Rohan Bopanna","question_statement":"Which of these tennis players has won an Olympic medal for India ?","option_d":"Mahesh Bhupathi","_ID":6,"recently_used":0},{"correct_option":"3","option_a":"Richard Eaton","option_b":"Tarun Vijay","option_c":"Surendra Kumar","question_statement":"The book “Modi’s Midas Touch in Foreign Policy” has been authored by whom?","option_d":"Mahendra Jogi","_ID":7,"recently_used":0}] ;
} ;

module.exports = {
  generate7RandomNumbers,
  get7RandomQuestions_DB,
  get7RandomQuestions
} ;