// Constants ---------------------------------------------------------
const resultEl = document.querySelector('#result');
const pauseEl = document.querySelector('.pause-btn');
const canvasEl = document.querySelector('#canvas');

const ctx = canvasEl.getContext('2d');

const paddleHitSound = new Audio('../sounds/Tennis-ball-hit.mp3');

// variables ---------------------------------------------------------
const ball = {
  positionX: canvasEl.width / 2, 
  positionY: canvasEl.height / 2,
  directionX: -1,
  directionY: 1,
  speedX: 4,   
  speedY: 4,
  size: 8,
};

const p1Paddle = {
  positionX: 20,
  positionY: 150,
  width: 15,
  height: 80,
  speed: 6,
};

const p2Paddle = {
  positionX: 565,
  positionY: 150,
  width: 15,
  height: 80,
  speed: 6,
};

let isPaused = false;

let gameStarted = false;
let opacity = 1;
let fadingOut = true;
let animationFrameId;

let countdownValue = 3;
let countdownActive = true;
let countdownIntervalId;

let freezBall = true;

let p1Score = 0;
let p2Score = 0;
let winningScore = 5;

let p1UpPressed = false;
let p1DownPressed = false;
let p2UpPressed = false;
let p2DownPressed = false;

let maxDown = canvasEl.height - p1Paddle.height;

// draw functions ----------------------------------------------------
function createStartScreen() {
  
    clearCanvas();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    ctx.save();
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Press ENTER to Start", canvasEl.width / 2, canvasEl.height / 2);

    ctx.restore();

    if (fadingOut) {
        opacity -= 0.01;
        if (opacity <= 0) {
            opacity = 0;
            fadingOut = false;
        }
    } else {
        opacity += 0.01;
        if (opacity >= 1) {
            opacity = 1;
            fadingOut = true;
        }
    }

    animationFrameId = requestAnimationFrame(createStartScreen);
};

function createBall () {
  ctx.beginPath();
  ctx.arc(ball.positionX, ball.positionY, ball.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

function createPaddle (paddle) {
  ctx.fillRect(paddle.positionX, paddle.positionY, paddle.width, paddle.height);
};

function clearCanvas () {
      ctx.clearRect(0, 0, 600, 400);
};

function createNet () {
  ctx.strokeStyle = 'white';
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvasEl.width / 2, 30);
  ctx.lineTo(canvasEl.width / 2, canvasEl.height - 30);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
};

function scoreText () {
  ctx.font = "20px Arial";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillText(`${p1Score}   :   ${p2Score}`, canvasEl. width / 2, 0);
};

function createCountDown () {
  if (countdownActive) {
    ctx.font = "100px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(countdownValue, canvasEl. width / 2, canvasEl.height / 2);
  }
};

// Logic functions ---------------------------------------------------
function paddleMovement () {
  if (p1UpPressed === true) {
    p1Paddle.positionY -= p1Paddle.speed;
    if (p1Paddle.positionY < 0) {
      p1Paddle.positionY = 0;
    }
  }
  if (p1DownPressed === true) {
    p1Paddle.positionY += p1Paddle.speed;
    if (p1Paddle.positionY > maxDown) {
      p1Paddle.positionY = maxDown;
    }
  }
  if (p2UpPressed === true) {
    p2Paddle.positionY -= p2Paddle.speed;
    if (p2Paddle.positionY < 0) {
      p2Paddle.positionY = 0;
    }
  }
  if (p2DownPressed === true) {
    p2Paddle.positionY += p2Paddle.speed;
    if (p2Paddle.positionY > maxDown) {
      p2Paddle.positionY = maxDown;
    }
  }
};

function ballMovement () {
  if (freezBall === true) {
    return;
  }

  ball.positionX += ball.speedX * ball.directionX;
  ball.positionY += ball.speedY * ball.directionY;
};

function ballWallCollision () {
  if (ball.positionY - ball.size < 0) {
    ball.directionY *= -1;
  }
  if (ball.positionY + ball.size > canvasEl.height) {
    ball.directionY *= -1;
  }
};

function ballSpeed () {
  if (ball.speedX !== 10) {
    ball.speedX += 1;
  }
};

// function hitAngle (paddle) {
//   const paddleCenter = (paddle.positionY + paddle.height) / 2;
//   const ballCenter = ball.positionY;
//   ball.positionY = (ballCenter - paddleCenter) * 0.05;
// };

function ballPaddleCollision () {
  const leftHorizontal = ball.positionX - ball.size  <= p1Paddle.positionX + p1Paddle.width && ball.positionX + ball.size >= p1Paddle.positionX;

  const leftVertical = ball.positionY - ball.size <= p1Paddle.positionY + p1Paddle.height && ball.positionY + ball.size >= p1Paddle.positionY;

  const rightHorizontal = ball.positionX + ball.size >= p2Paddle.positionX && ball.positionX - ball.size <= p2Paddle.positionX + p2Paddle.width;

  const rightVertical = ball.positionY + ball.size >= p2Paddle.positionY && ball.positionY - ball.size <= p2Paddle.positionY + p2Paddle.height;

  if (leftHorizontal && leftVertical) 
  {
    paddleHitSound.currentTime = 0;
    paddleHitSound.play();
    ball.positionX = p1Paddle.positionX + p1Paddle.width + ball.size;
    ball.directionX *= -1;
    // hitAngle(p1Paddle);
    ballSpeed();
  }

  if (rightHorizontal && rightVertical) 
  {
    paddleHitSound.currentTime = 0;
    paddleHitSound.play();
    ball.positionX = p2Paddle.positionX - ball.size;
    ball.directionX *= -1;
    // hitAngle(p2Paddle);
    ballSpeed();
  }
};

function resetBall () {
  ball.positionX =canvasEl.width / 2;
  ball.positionY =canvasEl.height / 2;
  ball.speedX = 4;
};

function playerScore () {
  if (ball.positionX + ball.size < 0) {
    p2Score += 1;
    resetBall();
  }
  else if (ball.positionX - ball.size > canvasEl.width) {
    p1Score += 1;
    resetBall();
  }
};

function gameReset () {

};

function render () {
  if (isPaused === true) {
    return;
  }
  ctx.fillStyle = 'white';
  ballMovement();
  paddleMovement();
  ballWallCollision();
  ballPaddleCollision();
  playerScore();
  clearCanvas();
  createNet();
  scoreText();
  createBall();
  createPaddle(p1Paddle);
  createPaddle(p2Paddle);
  createCountDown();
  requestAnimationFrame(render);
};

createStartScreen();

// Events ---------------------------------------------------------

document.addEventListener('keydown', (event) => {
  if (!gameStarted && event.key === "Enter") {
    gameStarted = true;
    cancelAnimationFrame(animationFrameId);
    render();

    countdownIntervalId = setInterval(() => {
      countdownValue -= 1;

      if (countdownValue < 1) {
        clearInterval(countdownIntervalId);
        countdownActive = false;
        freezBall = false;
    }
    }, 1000);
  }
  
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }

  if (event.key === "w") {
    p1UpPressed = true;
  }
  else if (event.key === "s") {
    p1DownPressed = true;
  }
  else if (event.key === "ArrowUp") {
    p2UpPressed = true;
  }
  else if (event.key === "ArrowDown") {
    p2DownPressed = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === "w") {
    p1UpPressed = false;
  }
  else if (event.key === "s") {
    p1DownPressed = false;
  }
  else if (event.key === "ArrowUp") {
    p2UpPressed = false;
  }
  else if (event.key === "ArrowDown") {
    p2DownPressed = false;
  }
});

  pauseEl.addEventListener('click', (event) => {
    if (!gameStarted) {
      return;
    }

  if (!isPaused) {
    isPaused = true;
  }
  else {
    isPaused = false
    render();
  }
});