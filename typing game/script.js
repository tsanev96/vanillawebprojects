const settingsEl = document.querySelector('#settings');
const difficultyEl = document.querySelector('#difficulty');
const givenWord = document.querySelector('#given-word');
const endGameMsg = document.querySelector('#end-game-container');
const rulesEl = document.querySelector('#rules');
const inputEl = document.querySelector('#input');
const scoreEl = document.querySelector('#score');
const timerEl = document.querySelector('#timer');
const guessedWordsEl = document.querySelector('#guessed-words');
const charactersEl = document.querySelector('#characters');
const rulesBtn = document.querySelector('#rules-button');
const closeBtn = document.querySelector('#close-button');

let selectedWord;
let score = 0;
let timer = 10;
let guessedWords = 0;
let characters = 0;
const timerInterval = setInterval(updateTime, 1000);

let difficulty = localStorage.getItem('difficulty') !== null ?
    localStorage.getItem('difficulty') : 'easy';

difficultyEl.value = localStorage.getItem('difficulty') !== null ?
    localStorage.getItem('difficulty') : 'easy';;

inputEl.focus();

async function displayWord() {
    const res = await fetch('https://random-word-api.herokuapp.com/word?number=1');
    const data = await res.json();
    let word = data[0];

    selectedWord = word;
    givenWord.innerText = word;
}

function addSecondsTimer() {
    if (difficulty === 'easy') {
        timer += 5;
    } else if (difficulty === 'medium') {
        timer += 3;
    } else {
        timer += 2;
    }

    updateTime();
}

function updateTime() {
    timer--;
    timerEl.innerText = timer + 's';

    if (timer === 0) {
        clearInterval(timerInterval);
        gameEndMessage();
    }

    if (timer <= 3) {
        timerEl.style.color = 'red';
    } else {
        timerEl.style.color = '#fff';
    }
}

function updateScore() {
    if (difficulty === 'hard') {
        score += 2;
    } else {
        score++;
    }
    scoreEl.innerText = score;
}

function updateWords() {
    guessedWords++;
    guessedWordsEl.innerText = guessedWords;
}

function updateCharacters() {
    characters += selectedWord.length;
    charactersEl.innerText = characters;
}

function gameEndMessage() {
    endGameMsg.innerHTML =
        `
    <h1>You ran out of time!</h1>
    <h2>Score: ${score}, Words: ${guessedWords}, Characters: ${characters}</h2>
    <button onclick='location.reload()'
            class="play-again-button">Play Again</button>
    `;

    endGameMsg.style.display = 'flex';
}

// Event Handlers
inputEl.addEventListener('input', e => {
    let enteredText = e.target.value;
    let compareText = selectedWord.substring(0, enteredText.length);

    if (enteredText === selectedWord) {
        debugger;
        e.target.value = '';
        addSecondsTimer();
        updateTime();
        updateScore();
        updateWords();
        updateCharacters();
        displayWord();
    } else if (enteredText === compareText) {
        inputEl.classList.remove('error');
    } else {
        inputEl.classList.add('error');
    }
});

difficultyEl.addEventListener('change', e => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);
});

rulesBtn.addEventListener('click', () => {
    rulesEl.classList.add('show');
    settingsEl.classList.add('hide');
});

closeBtn.addEventListener('click', () => {
    rulesEl.classList.remove('show');
    settingsEl.classList.remove('hide');
});

displayWord();