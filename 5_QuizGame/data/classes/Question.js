class Question{
  constructor(jsonObject){
    this.question_statement = jsonObject.question_statement ;
    this.option_a = jsonObject.option_a ;
    this.option_b = jsonObject.option_b ;
    this.option_c = jsonObject.option_c ;
    this.option_d = jsonObject.option_d ;
    this.correct_option = jsonObject.correct_option ;
  }

  toJSON(){
    return {
      question_statement : this.question_statement,
      option_a : this.option_a,
      option_b : this.option_b,
      option_c : this.option_c,
      option_d : this.option_d,
      correct_option : this.correct_option,

    } ;
  }
}