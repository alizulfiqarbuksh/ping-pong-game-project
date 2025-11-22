// Constants ---------------------------------------------------------
const canvasEl = document.querySelector('#canvas');

const ctx = canvasEl.getContext('2d');

ctx.fillStyle = 'white';


// variables ---------------------------------------------------------
const ball = {
  positionX: 300, 
  positionY: 200,
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

function displayElements () {
  clearCanvas();
  createBall();
  createPaddle(p1Paddle);
  createPaddle(p2Paddle); 
  requestAnimationFrame(displayElements);
};

displayElements();

