let score = 0;
let correctAnswer = 0;
let gameIsRunning = false;
let highscore = 0;
let timerInterval;

// --- CONFIGURATION CONSTANT ---
const LEVEL_SETTINGS = {
    easy: { maxNumber: 10, operators: ['+', '-'], timeLimit: 10 },
    medium: { maxNumber: 20, operators: ['+', '-', '*'], timeLimit: 7 },
    hard: { maxNumber: 50, operators: ['+', '-', '*', '/'], timeLimit: 4 }
};

// --- DOM Elements ---
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('high-score');
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-btn');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const questionBox = document.getElementById('question-box');
const gameOverArea = document.getElementById('game-over-area');
const gameArea = document.getElementById('game-area');
const finalScoreElement = document.getElementById('final-score');
const highScoreMessage = document.getElementById('high-score-message');
const difficultySelect = document.getElementById('difficulty'); // NEW ELEMENT

// --- Initialization ---
function loadHighScore() {
    const savedScore = localStorage.getItem('mathQuizHighScore');
    if (savedScore) {
        highscore = parseInt(savedScore, 10);
        highscoreElement.textContent = highscore;
    }
}

// Function to generate a random question based on the selected level
function generateQuestion() {
    const selectedLevel = difficultySelect.value;
    const settings = LEVEL_SETTINGS[selectedLevel];
    const max = settings.maxNumber;
    const operators = settings.operators;

    const opIndex = Math.floor(Math.random() * operators.length);
    const operator = operators[opIndex];

    let num1 = Math.floor(Math.random() * max) + 1;
    let num2 = Math.floor(Math.random() * max) + 1;
    let questionText = '';
    
    // Logic for different operators and ensuring valid answers
    if (operator === '+') {
        questionText = `${num1} + ${num2} = ?`;
        correctAnswer = num1 + num2;
    } else if (operator === '-') {
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        questionText = `${larger} - ${smaller} = ?`;
        correctAnswer = larger - smaller;
    } else if (operator === '*') {
        num1 = Math.floor(Math.random() * (max / 5)) + 1; 
        num2 = Math.floor(Math.random() * (max / 5)) + 1;
        questionText = `${num1} * ${num2} = ?`;
        correctAnswer = num1 * num2;
    } else if (operator === '/') {
        correctAnswer = Math.floor(Math.random() * (max / 5)) + 1;
        num2 = Math.floor(Math.random() * 10) + 2;
        num1 = correctAnswer * num2;
        questionText = `${num1} / ${num2} = ?`;
    }

    questionElement.textContent = questionText;
    answerInput.value = '';
    answerInput.focus();
    questionBox.classList.remove('wrong-feedback');
    
    startTimer(); 
}

// Function to start the timer for a single question
function startTimer() {
    clearInterval(timerInterval);
    
    const selectedLevel = difficultySelect.value;
    const timeLimit = LEVEL_SETTINGS[selectedLevel].timeLimit;
    let timeLeft = timeLimit;
    timerElement.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(true);
        }
    }, 1000);
}

// Function to check the submitted answer
function checkAnswer() {
    if (!gameIsRunning) return;

    const userAnswer = parseInt(answerInput.value, 10);
    
    if (isNaN(userAnswer)) return; 

    clearInterval(timerInterval);

    if (userAnswer === correctAnswer) {
        score++;
        scoreElement.textContent = score;
        
        questionBox.classList.add('correct-feedback');
        setTimeout(() => {
            questionBox.classList.remove('correct-feedback');
            generateQuestion();
        }, 150); 
    } else {
        questionBox.classList.add('wrong-feedback');
        setTimeout(() => endGame(false), 500);
    }
}

// Function to start or restart the game
function startGame() {
    score = 0;
    gameIsRunning = true;
    scoreElement.textContent = score;
    
    questionBox.classList.remove('wrong-feedback', 'correct-feedback');

    gameArea.classList.remove('hidden');
    gameOverArea.classList.add('hidden');
    startButton.classList.add('hidden');
    
    // ⬇️ THIS LINE PREVENTS CHANGING LEVEL MID-GAME ⬇️
    difficultySelect.disabled = true; 
    
    submitButton.disabled = false;
    answerInput.disabled = false;
    
    generateQuestion();
}

// Function to stop the game
function endGame(isTimeUp) {
    gameIsRunning = false;
    clearInterval(timerInterval);
    
    // High Score Logic
    let message = isTimeUp ? `Time's up! Your final score is ${score}.` : `Incorrect Answer! Game Over.`;
    
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('mathQuizHighScore', highscore);
        highscoreElement.textContent = highscore;
        message = `New High Score! 🎉 You reached ${score} points!`;
    }

    finalScoreElement.textContent = score;
    highScoreMessage.textContent = message;

    // Toggle visibility and controls
    gameArea.classList.add('hidden');
    gameOverArea.classList.remove('hidden');
    
    answerInput.disabled = true;
    submitButton.disabled = true;
    startButton.classList.remove('hidden'); 
    
    // ⬆️ THIS LINE RE-ENABLES THE LEVEL SELECTOR AFTER THE GAME IS OVER ⬆️
    difficultySelect.disabled = false; 
}


// --- Event Listeners and Initial Load ---
startButton.addEventListener('click', startGame);
// The 'Play Again' button (restartButton) calls startGame, 
// which means the level is briefly available for selection before the next game starts.
restartButton.addEventListener('click', startGame); 
submitButton.addEventListener('click', checkAnswer);

// Allow pressing Enter key to submit the answer
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !submitButton.disabled) {
        checkAnswer();
    }
});

loadHighScore();