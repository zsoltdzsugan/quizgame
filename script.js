import { quizQuestions } from './quizQuestions.js';

let SCORE = 0;
let HEALTH = 3;
let LEADERBOARD = [];
let questionCounter = 0;
let healthDiv = document.querySelector('.health');
let scoreDiv = document.querySelector('.score');
const originalQuizQuestions = [...quizQuestions];
let currentQuizQuestions = originalQuizQuestions;

if (localStorage.getItem('leaderboard')) {
    LEADERBOARD = JSON.parse(localStorage.getItem('leaderboard'));
}

function gameStart() {
    SCORE = 0;
    HEALTH = 3;
    questionCounter = 0;
    healthDiv.innerHTML = '<i class="fa-solid fa-heart"></i>'.repeat(HEALTH);
    scoreDiv.innerHTML = "Pontjaid: " + SCORE;
    showLeaderboard(LEADERBOARD);
    console.log(LEADERBOARD);
    gameLoop();
    
}

function gameLoop() {
    if (questionCounter < 51 && HEALTH > 0) {
        let randomObject = getRandomQuestion(currentQuizQuestions);

        questionCounter++;
        if (randomObject === null) {
            gameOver();
        } else {
            randomQuestionToHtml(randomObject, questionCounter);
            getAnswer(randomObject);
        }       
    } else {
        gameOver();
    }
}

function gameOver() {
    console.log(SCORE);
    console.log(isBetterScore(SCORE));
    if (isBetterScore(SCORE)) {
        const playerName = promptForName();
        updateLeaderBoard(playerName, SCORE);
    }
    localStorage.setItem('leaderboard', JSON.stringify(LEADERBOARD));
    document.querySelector('.restartBtn').style.display = 'flex';
}

document.querySelector('.restartBtn').addEventListener('click', () => {
    resetGame();
    gameStart();
});

function resetGame() {
    currentQuizQuestions = [...originalQuizQuestions];
    document.querySelector('.restartBtn').style.display = 'none';
    document.querySelector('.leaderboard').innerHTML = '';
}

function isBetterScore(score) {
    if (LEADERBOARD.length < 5 && score > 0) {
        return true;
    }
    for (const player of LEADERBOARD) {
        if (score >= player.score)
        return true;
    }
    return false;
}

function promptForName() {
    const playerName = prompt("Gratulálok! Felkerültél a ranglistára! Add meg a neved: ");
    return playerName;
}

function updateLeaderBoard(playerName, playerScore) {
    LEADERBOARD.unshift({ name: playerName, score: playerScore });
    LEADERBOARD.sort((a,b) => b.score - a.score);
}

function showLeaderboard(LEADERBOARD) {
    let leaderboard = document.querySelector('.leaderboard');
    if (LEADERBOARD.length < 5) {
        LEADERBOARD.forEach((element, i) => {
            leaderboard.innerHTML += `<tr>
            <th scope="row">${i+1}</th>
            <td>${element.name}</td>
            <td>${element.score}</td>
          </tr>`;
        })
    } else {
        for (let i = 0; i < 5; i++) {
            const element = LEADERBOARD[i];
            leaderboard.innerHTML += `<tr>
            <th scope="row">${i+1}</th>
            <td>${element.name}</td>
            <td>${element.score}</td>
          </tr>`;
        };
    }
}

function getRandomQuestion(listOfObjects) {
    if (listOfObjects.length === 0) {
        return null;
    }
    let randomNumber = Math.floor(Math.random() * listOfObjects.length);
    let randomObject = listOfObjects.splice(randomNumber, 1);
    return randomObject;
}

function randomQuestionToHtml(randomObject, counter) {
    document.querySelector('.question').textContent = `${counter}. ${randomObject[0].question}`;
}

function getAnswer(randomObject) {
    let answerInput = document.querySelector('#answerInput');
    let answerSubmit = document.querySelector('#answerSubmit');

    answerSubmit.addEventListener('click', function checkAnswer() {
        const playerAnswer = answerInput.value;

        if (playerAnswer.toLowerCase() === randomObject[0].answer.toLowerCase()) {
            SCORE++;
            scoreDiv.innerHTML = "Pontjaid: " + SCORE;
        } else {
            HEALTH--;
            healthDiv.innerHTML = '<i class="fa-solid fa-heart"></i>'.repeat(HEALTH);
            healthDiv.innerHTML += '<i class="fa-regular fa-heart"></i>'.repeat(3-HEALTH);
        }
        answerInput.value = '';
        answerSubmit.removeEventListener('click', checkAnswer);
        gameLoop();
    });
}

gameStart();