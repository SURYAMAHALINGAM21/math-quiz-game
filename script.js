let score = 0;
let correctAnswer = 0;
let gameIsRunning = false;
let highscore = 0;
let timerInterval;

// --- CONFIGURATION CONSTANT ---
const LEVEL_SETTINGS = {
    easy: { maxNumber: 10, operators: ['+', '-'], timeLimit: 10 },
    medium: { maxNumber: 20, operators: ['+', '-', '*'], timeLimit: 7 },
    hard: { maxNumber: 50, operators: ['+', '-', '*', '/'], timeLimit: 4 } // Added division for 'hard'
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
        // Ensure result is non-negative
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        questionText = `${larger} - ${smaller} = ?`;
        correctAnswer = larger - smaller;
    } else if (operator === '*') {
        // Keep numbers smaller for multiplication (adjust if needed)
        num1 = Math.floor(Math.random() * (max / 5)) + 1; 
        num2 = Math.floor(Math.random() * (max / 5)) + 1;
        questionText = `${num1} * ${num2} = ?`;
        correctAnswer = num1 * num2;
    } else if (operator === '/') {
        // Ensure division results in a whole number
        correctAnswer = Math.floor(Math.random() * (max / 5)) + 1;
        num2 = Math.floor(Math.random() * 10) + 2; // Divisor
        num1 = correctAnswer * num2; // Dividend
        questionText = `${num1} / ${num2} = ?`;
    }

    questionElement.textContent = questionText;
    answerInput.value = '';
    answerInput.focus();
    questionBox.classList.remove('wrong-feedback');
    
    // Restart the timer for the new question
    startTimer(); 
}

// Function to start the timer for a single question
function startTimer() {
    clearInterval(timerInterval); // Stop any existing timer
    
    const selectedLevel = difficultySelect.value;
    const timeLimit = LEVEL_SETTINGS[selectedLevel].timeLimit;
    let timeLeft = timeLimit;
    timerElement.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(true); // End game due to time up
        }
    }, 1000);
}

// Function to check the submitted answer
function checkAnswer() {
    if (!gameIsRunning) return;

    const userAnswer = parseInt(answerInput.value, 10);
    
    if (isNaN(userAnswer)) return; 

    clearInterval(timerInterval); // Stop timer while processing answer

    if (userAnswer === correctAnswer) {
        score++;
        scoreElement.textContent = score;
        
        // Correct feedback
        questionBox.classList.add('correct-feedback');
        setTimeout(() => {
            questionBox.classList.remove('correct-feedback');
            generateQuestion(); // Generate the next question
        }, 150); 
    } else {
        // Wrong answer: End the game
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
    difficultySelect.disabled = true; // Disable level selection during play
    
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
    difficultySelect.disabled = false; // Re-enable level selection
}


// --- Event Listeners and Initial Load ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
submitButton.addEventListener('click', checkAnswer);

// Allow pressing Enter key to submit the answer
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !submitButton.disabled) {
        checkAnswer();
    }
});

// Load high score when the page loads
loadHighScore();