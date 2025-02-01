const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 9 * box, y: 9 * box }];
let direction = 'RIGHT';
let fruit = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let traps = [];

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw fruit
  ctx.fillStyle = 'red';
  ctx.fillRect(fruit.x, fruit.y, box, box);
  
  // Draw traps
  ctx.fillStyle = 'black';
  for (let trap of traps) {
    ctx.fillRect(trap.x, trap.y, box, box);
  }
  
  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'green' : 'lightgreen';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  
  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, box, box);

  // Move snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX -= box;
  if (direction === 'UP') snakeY -= box;
  if (direction === 'RIGHT') snakeX += box;
  if (direction === 'DOWN') snakeY += box;

  // Check if snake eats fruit
  if (snakeX === fruit.x && snakeY === fruit.y) {
    fruit = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    score++; // Increase score
  } else {
    snake.pop();
  }

  // Check for collision with traps
  for (let trap of traps) {
    if (snakeX === trap.x && snakeY === trap.y) {
      // Remove half of the snake's length
      snake = snake.slice(0, Math.ceil(snake.length / 2));
    }
  }

  // Add new head
  const newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead);
  
  // AI Logic to navigate towards fruit and avoid traps
  if (snakeX < fruit.x && !isTrapInDirection(snakeX + box, snakeY)) direction = 'RIGHT';
  else if (snakeX > fruit.x && !isTrapInDirection(snakeX - box, snakeY)) direction = 'LEFT';
  else if (snakeY < fruit.y && !isTrapInDirection(snakeX, snakeY + box)) direction = 'DOWN';
  else if (snakeY > fruit.y && !isTrapInDirection(snakeX, snakeY - box)) direction = 'UP';
}

// Function to generate traps
function generateTraps() {
  for (let i = 0; i < 2; i++) {
    const trap = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
    traps.push(trap);
  }
}

// Function to check if there's a trap in the direction
function isTrapInDirection(x, y) {
  return traps.some(trap => trap.x === x && trap.y === y);
}

// Generate traps every second
setInterval(generateTraps, 1000);

setInterval(draw, 100);
