/*
// Quiz.js
export class Quiz {
    constructor(isCollide) {
        this.isCollide = isCollide;
        
        this.questions = [
            { question: 'Is Malaysia a country?', answers: ['Yes', 'No'], correct: 0 },
            { question: 'How many members does BTS have?', answers: ['8', '7'], correct: 1 },
            // ... Add more questions as needed
        ];
        this.currentQuestionIndex = 0;
        this.nextQuestionTime = Date.now() + 5000;  // 5 seconds after game start
        this.betweenQuestionsTime = 10000;  // 10 seconds between questions
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    checkCollision(playerX, answerBoxX) {
        return this.isCollide(playerX, 0.5, answerBoxX, 0.5);
        // ... Use the isCollide function from rendered.js
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.nextQuestionTime = Date.now() + this.betweenQuestionsTime;
    }
    

}
*/
