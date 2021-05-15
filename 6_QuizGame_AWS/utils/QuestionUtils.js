const fs = require('fs') ;
const AWS = require('aws-sdk') ;

AWS.config.update({
  region: "ap-south-1",
  endpoint: "http://localhost:8000"
}) ;

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



module.exports = {
  generate7RandomNumbers,
  get7RandomQuestions_DB
} ;