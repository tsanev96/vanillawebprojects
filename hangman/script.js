const figureParts = document.querySelectorAll('.figure-parts');
const faceParts = document.querySelectorAll('.figure-face');
const wordEl = document.querySelector('#word');
const wrongLettersEl = document.querySelector('#wrong-letters');
const finalMessage = document.querySelector('#final-message');
const winnerEl = document.querySelector('#winner');
const notification = document.querySelector('#notification');
const gameFinished = document.querySelector('#game-finished');
const revealedWord = document.querySelector('#reveal-word');

const playAgainBtn = document.querySelector('#play-button');
const hintButton = document.querySelector('#hint-button');

const words = ['programming', 'javascript', 'array', 'map', 'filter', 'object', 'function',
    'document', 'foreach', 'loop'
];

let gamePlayable = true;
let correctLetters = [];
let wrongLetters = [];
let selectedWord = getRandomWord();

function displayWord() {

    wordEl.innerHTML = `
    ${selectedWord.split('')
        .map(letter=> `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `).join('')}`;

    const innerWord = wordEl.innerText.replace(/\n/g,'');

    if (innerWord===selectedWord) {
        finalMessage.innerText='Congrats! You Won!';
        showEndgameMessage();
    }
}

function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}

function showNotification() {

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function showEndgameMessage() {
    gameFinished.style.display='flex';
    gamePlayable=false;
}

function updateWrongLettersShowFigure() {

    wrongLettersEl.innerHTML=`
    <p>Wrong Letters:</p>
    ${wrongLetters.map(letter=> `<span>${letter}</span>`)}
    `;

    wrongLetters.forEach((part,index)=>{
        
        const mistakes = wrongLetters.length;

        if (index<mistakes) {
            figureParts[index].style.display='block';
            faceParts.forEach(part=>{
                part.style.display='block';
            });
        } 

        if (mistakes===6) {
            finalMessage.innerText="Unfortunately you lost :(";
            revealedWord.innerText='Word: '+selectedWord;
            showEndgameMessage();
        }
    })
    
}

window.addEventListener('keydown',e=>{
    if (gamePlayable) {
         if (e.keyCode>=65 && e.keyCode<=90) {
              const letter = e.key;

             if (selectedWord.includes(letter)) {
            
                if (correctLetters.includes(letter)) {
                    showNotification();
                 } else {
                    correctLetters.push(letter);
                    displayWord();
             }
        } else {
                 if (wrongLetters.includes(letter)) {
                    showNotification();
                } else {
                wrongLetters.push(letter);
            
                updateWrongLettersShowFigure();
            }

        }
    }
}
});

playAgainBtn.addEventListener('click',()=>{
    gamePlayable=true;
    gameFinished.style.display='none';
    selectedWord=getRandomWord();
    wrongLetters.splice(0);
    correctLetters.splice(0);
    revealedWord.innerHTML='';
    
    displayWord();

    wrongLettersEl.innerHTML='';
    figureParts.forEach(part=>{
        part.style.display='none';
    });

    faceParts.forEach(part =>{
        part.style.display='none';
    });
});

hintButton.addEventListener('click',()=>{

    let hintGiven=false;

   while (!hintGiven) {
       let randomIndex=Math.floor(Math.random()*selectedWord.length);
       let letter = selectedWord[randomIndex];

       if (!correctLetters.includes(letter)) {
           correctLetters.push(letter);
           displayWord();
           hintGiven=true;
       }
   }

});

displayWord();