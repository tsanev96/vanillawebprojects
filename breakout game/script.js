const rulesBtn = document.querySelector('#rules-btn');
const closeBtn = document.querySelector('#close-btn');
const rules = document.querySelector('#rules');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let score = 0;
const bricksRowCount = 10;
const bricksColCount = 4;

let ballReleased = false;

const brickColors = [
    '#FAEBD7',
    '#7FFFD4',
    '#D2691E',
    '#6495ED',
    '#008B8B',
    '#556B2F',
    '#BDB76B',
    '#90EE90'
];

// Create ball, paddle and bricks props
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 25,
    size: 10,
    dx: 5,
    dy: -5
}

const paddle = {
    // x:left,y:top left
    x: canvas.width / 2 - 40,
    y: canvas.height - 15,
    w: 90,
    h: 11,
    speed: 12,
    dx: 0
}

const brick = {
    w: 70,
    h: 15,
    offsetX: 28,
    offsetY: 45,
    padding: 5,
    visible: true,
    color: 'none'
}

// Bricks matrix
const bricks = [];
for (let i = 0; i < bricksRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < bricksColCount; j++) {
        brick.color = getRandomColor();
        const x = i * (brick.w + brick.padding) + brick.offsetX;
        const y = j * (brick.h + brick.padding) + brick.offsetY;
        bricks[i][j] = { x, y, ...brick };
    }
}

// Draw ball, paddle, bricks and score
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? brick.color : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * brickColors.length);
    return brickColors[randomIndex];
}

function moveBall() {
    if (!ballReleased) {
        ball.x = paddle.x + 40;
        ball.y = paddle.y - 10;
        console.error('stopped');
        return;
    }
    console.log('X:', ball.x);
    console.log('Y:', ball.y);
    ball.x += ball.dx;
    ball.y += ball.dy;

    // wall collision
    if (ball.y - ball.size < 0) {
        ball.dy *= -1;
    } else if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
        ball.dx *= -1;
    }

    if (ball.y + ball.size > canvas.height) {
        ballReleased = false;
        ball.dy *= -1;
        score = 0;
        makeAllBricksVisible();
    }

    // paddle collision
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy *= -1;
    }
    // brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    // ball.x + ball.size < brick.x + brick.padding &&
                    // ball.x - ball.size > brick.x &&
                    // ball.y + ball.size < brick.y &&
                    // ball.y - ball.size > brick.y + brick.h
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });
}

// Paddle smooth moving
let leftPressed = false;
let rightPressed = false;

function movePaddle() {
    if (leftPressed) {
        paddle.dx = -paddle.speed;
    } else if (rightPressed) {
        paddle.dx = paddle.speed;
    } else {
        paddle.dx = 0;
    }

    paddle.x += paddle.dx;

    // wall collision left to right
    if (paddle.x < 2) {
        paddle.x = 2;
    } else if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w - 2;
    }


}

function makeAllBricksVisible() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true;
        });
    });
}

function increaseScore() {
    return score++;
}

function keyDownHandler(event) {
    if (event.keyCode === 37 || event.keyCode === 65) {
        leftPressed = true;
    } else if (event.keyCode === 39 || event.keyCode === 68) {
        rightPressed = true;
    }
}

function keyupHandler(event) {
    if (event.keyCode === 37 || event.keyCode === 65) {
        leftPressed = false;
    } else if (event.keyCode === 39 || event.keyCode === 68) {
        rightPressed = false;
    }
}

function releaseBall(event) {
    if (event.keyCode === 32) {
        ballReleased = true;
    }
    console.log(ballReleased);
}

// Update canvas and draw
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePaddle();
    moveBall();

    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();

    requestAnimationFrame(update);
}

update();


// Release ball handler
document.addEventListener('keydown', releaseBall);

//Key paddle handlers
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyupHandler, false);

// Rules handlers
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
});