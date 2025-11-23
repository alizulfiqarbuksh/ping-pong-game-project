// Constants ---------------------------------------------------------
const canvasEl = document.querySelector('#canvas');

const ctx = canvasEl.getContext('2d');

ctx.fillStyle = 'white';


// variables ---------------------------------------------------------
const ball = {
  positionX: 300, 
  positionY: 200,
  directionX: -1,
  directionY: 1,
  speedX: 1,   
  speedY: 1,
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

p1Score = 0;
p2Score = 0;

let p1UpPressed = false;
let p1DownPressed = false;
let p2UpPressed = false;
let p2DownPressed = false;

let maxDown = canvasEl.height - p1Paddle.height;

// Functions ---------------------------------------------------------
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
  ball.positionX += ball.speedX * ball.directionX;
  ball.positionY += ball.speedY * ball.directionY;
};

function ballWallCollision () {
  if (ball.positionY - ball.size < 0) {
    ball.directionY *= -1;
    ball.speedX += 0.5;
  }
  if (ball.positionY + ball.size > canvasEl.height) {
    ball.directionY *= -1;
    ball.speedX += 0.5;
  }
};

function ballPaddleCollision () {
  if (ball.positionX - ball.size  <= p1Paddle.positionX + p1Paddle.width && ball.positionY - ball.size >= p1Paddle.positionY && ball.positionY + ball.size <= p1Paddle.positionY + p1Paddle.height) {
    ball.directionX *= -1;
  }

  if (ball.positionX + ball.size  >= p2Paddle.positionX && ball.positionY - ball.size >= p2Paddle.positionY && ball.positionY + ball.size <= p2Paddle.positionY + p2Paddle.height) {
    ball.directionX *= -1;
  }
};

function playerScore () {
  if (ball.positionX + ball.size < 0) {
    p2Score += 1;
    ball.positionX =canvasEl.width / 2;
    ball.positionY =canvasEl.width / 2;
    console.log("p2 Score = " + p2Score);
  }
  else if (ball.positionX - ball.size > canvasEl.width) {
    p1Score += 1;
    ball.positionX =canvasEl.width / 2;
    ball.positionY =canvasEl.width / 2;
    console.log("p1 Score = " + p1Score);
  }
};

function displayElements () {
  ballMovement();
  paddleMovement();
  ballWallCollision();
  ballPaddleCollision();
  playerScore();
  clearCanvas();
  createBall();
  createPaddle(p1Paddle);
  createPaddle(p2Paddle); 
  requestAnimationFrame(displayElements);
};

displayElements();

// Events ---------------------------------------------------------
document.addEventListener('keydown', (event) => {
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