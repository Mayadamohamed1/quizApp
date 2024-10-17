// https://opentdb.com/api.php?amount=3&category=16&difficulty=medium
let form = document.getElementById("quizOptions");
let categoryMenu = document.getElementById("categoryMenu");
let difficultyOptions = document.getElementById("difficultyOptions");
let questionsNumber = document.getElementById("questionsNumber");
let startQuiz = document.getElementById("startQuiz");
let myRow = document.querySelector(".questions .container .row");
let questions;
let myQuiz;
startQuiz.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;
  myQuiz = new Quis(category, difficulty, number);
  questions = await myQuiz.getAllQuestion();
  console.log(questions);
  let myQuestion = new Question(0);
  console.log(myQuestion);
  form.classList.replace("d-flex", "d-none");
  myQuestion.display();
});

class Quis {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }
  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }
  async getAllQuestion() {
    let result = await fetch(this.getApi());
    let data = await result.json();
    // console.log(data.results)
    return data.results;
  }

  showResult() {
    return `
      <div
        class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <h2 class="mb-0">
        ${
          this.score == this.number
            ? `Congratulations`
            : `Your score is ${this.score}`
        }      
        </h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.question = questions[index].question;
    this.difficulty = questions[index].difficulty;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.category = questions[index].category;
    this.allAnswers = this.getAllQuestions();
    this.isAnswered=false
  }
  getAllQuestions() {
    let allAnswers = [...this.incorrect_answers, this.correct_answer];
    return allAnswers.sort();
  }
  display() {
    const questionMarkUp = `
    <div
      class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
    >
      <div class="w-100 d-flex justify-content-between">
        <span class="btn btn-category">${this.category}</span>
        <span class="fs-6 btn btn-questions">${this.index + 1} of ${
      questions.length
    } Questions</span>
      </div>
      <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
      <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
      ${this.allAnswers
        .map((answer) => `<li> ${answer} </li>`)
        .toString()
        .replaceAll(",", "")}
      </ul>
      <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${
        myQuiz.score
      }</h2>        
    </div>
  `;

    myRow.innerHTML = questionMarkUp;

    const choicesElements = document.querySelectorAll("ul li");
    for (let i = 0; i < choicesElements.length; i++) {
      choicesElements[i].addEventListener("click", () => {
        this.checkAnswer(choicesElements[i]);
        //   this.animateQuestion(choicesElements[i], 1000);
          this.nextQuestion();
      });
    }
  }
  checkAnswer(choice) {
   if(!this.isAnswered){
    this.isAnswered= true
    if(choice.innerHTML.trim() == this.correct_answer){
        choice.classList.add('correct', 'animate__animated', 'animate__pulse')
        myQuiz.score++; 
    }else{
        choice.classList.add('wrong' , 'animate__animated', 'animate__shakeX')
    }
  }
   }
   nextQuestion(){
    this.index++;

   setTimeout(() =>{
   if(this.index < questions.length){
    let myNewQues= new Question(this.index)
    myNewQues.display()
   } 
   else{
   let result = myQuiz.showResult()
   myRow.innerHTML= result
   document.querySelector('.question .again').addEventListener('click', function(){
    window.location.reload()
   })
   }
   } , 2000)
   }
}
