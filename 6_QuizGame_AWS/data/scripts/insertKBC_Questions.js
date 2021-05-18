/* This file is used one time to insert the thousands of question in the dynamoDB database
 *
 */
const fs = require('fs') ;
const AWS = require('aws-sdk') ;

// AWS.config.update({
//   region: "ap-south-1",
//   endpoint: "http://localhost:8000"
// }) ;

AWS.config.loadFromPath('./../../secret/aws_credentials.json');

let docClient = new AWS.DynamoDB.DocumentClient() ;
let questionsArray = JSON.parse(fs.readFileSync(__dirname + './../fake_db/question_table.json')) ;

questionsArray.forEach((question)=>{

  let insertObject = {
      TableName : 'Questions',
      Item : {
        _ID : question._ID,
        question_statement : question.question_statement,
        option_a : question.option_a,
        option_b : question.option_b,
        option_c : question.option_c,
        option_d : question.option_d,
        correct_option : question.correct_option,
      }
  } ;

  docClient.put(insertObject, (err, data)=>{
    if(err){
      console.log("Error in inserting data ", JSON.stringify(err, null, 2)) ;
    }else{

    }


  }) ;


}) ;

console.log("Successfully inserted documents") ;