let score = 0;
let correctAnswer = 0;
let gameIsRunning = false;

// DOM Elements
const scoreElement = document.getElementById('score');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-btn');
const startButton = document.getElementById('start-btn');
const gameOverArea = document.getElementById('game-over-area');
const gameArea = document.getElementById('game-area');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');

// --- Core Game Functions ---

// Function to generate a random simple math question (addition or subtraction)
function generateQuestion() {
    // Generate two random numbers between 1 and 20
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    
    // Randomly choose operator: 0 for +, 1 for -
    const operator = Math.random() < 0.5 ? '+' : '-';

    let questionText = '';
    
    if (operator === '+') {
        questionText = `${num1} + ${num2} = ?`;
        correctAnswer = num1 + num2;
    } else {
        // Ensure the result is non-negative for simplicity
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        questionText = `${larger} - ${smaller} = ?`;
        correctAnswer = larger - smaller;
    }

    questionElement.textContent = questionText;
    answerInput.value = ''; // Clear previous answer
    answerInput.focus();
}

// Function to check the submitted answer
function checkAnswer() {
    if (!gameIsRunning) return;

    const userAnswer = parseInt(answerInput.value, 10);
    
    // Simple validation
    if (isNaN(userAnswer)) {
        alert("Please enter a valid number.");
        answerInput.focus();
        return;
    }

    if (userAnswer === correctAnswer) {
        // Correct answer: increase score and generate new question
        score++;
        scoreElement.textContent = score;
        generateQuestion();
    } else {
        // Wrong answer: end the game
        endGame();
    }
}

// Function to start or restart the game
function startGame() {
    score = 0;
    gameIsRunning = true;
    scoreElement.textContent = score;
    
    // Toggle visibility
    gameArea.classList.remove('hidden');
    gameOverArea.classList.add('hidden');
    
    // Enable/Disable buttons and input
    startButton.classList.add('hidden');
    submitButton.disabled = false;
    answerInput.disabled = false;
    
    generateQuestion();
}

// Function to stop the game
function endGame() {
    gameIsRunning = false;
    finalScoreElement.textContent = score;
    
    // Toggle visibility
    gameArea.classList.add('hidden');
    gameOverArea.classList.remove('hidden');
    
    // Disable input and submit button
    answerInput.disabled = true;
    submitButton.disabled = true;
}

// --- Event Listeners ---

// Start button initiates the game
startButton.addEventListener('click', startGame);

// Restart button initiates the game
restartButton.addEventListener('click', startGame);

// Submit button checks the answer
submitButton.addEventListener('click', checkAnswer);

// Allow pressing Enter key to submit the answer
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !submitButton.disabled) {
        checkAnswer();
    }
});