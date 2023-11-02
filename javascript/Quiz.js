// export class Quiz {
//     constructor(questions) {
//         this.questions = questions;
//         this.currentQuestionIndex = 0;
//         this.quizBox = document.getElementById('quizBox');  // Update this line
//         this.questionBox = document.getElementById('questionBox');  // Update this line
//         this.optionsBox = document.getElementById('optionsBox');  // Update this line
//         document.getElementById('game').appendChild(this.quizBox);
//         this.displayQuestion();
//     }
//
//     displayQuestion() {
//         let currentQuestion = this.questions[this.currentQuestionIndex];
//         this.questionBox.innerText = currentQuestion.question;
//         this.optionsBox.innerHTML = '';
//         for (let i = 0; i < currentQuestion.options.length; i++) {
//             let optionButton = document.createElement('button');
//             optionButton.innerText = currentQuestion.options[i];
//             // optionButton.addEventListener('click', () => this.checkAnswer(i));
//             this.optionsBox.appendChild(optionButton);
//         }
//     }
//
//     areAllQuestionsAnswered() {
//         return this.currentQuestionIndex >= this.questions.length;
//     }
//
//     /*checkAnswer(index) {
//         console.log("All questions answered");
//
//         let currentQuestion = this.questions[this.currentQuestionIndex];
//         /!*if (index === currentQuestion.correctAnswer) {
//             console.log('checkAnswer index run');
//         } else {
//             /!*console.log('Wrong Answer!');*!/
//         }*!/
//         this.currentQuestionIndex++;
//         if (this.currentQuestionIndex < this.questions.length) {
//             this.displayQuestion();
//         } else {
//             console.log("All questions answered");
//         }
//
//     }*/
// }