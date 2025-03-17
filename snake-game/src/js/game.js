// Game variables
let canvas;
let ctx;
let snake;
let food;
let score;
let gameInterval;

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    snake = new Snake();
    food = createFood();
    score = 0;
    gameInterval = setInterval(updateGame, 100);
}

// Update the game state
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.move();
    drawFood();
    snake.draw();
    checkCollision();
}

// Create food at a random position
function createFood() {
    const x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    const y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
    return { x, y };
}

// Draw food on the canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

// Check for collisions
function checkCollision() {
    if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
        snake.grow();
        food = createFood();
        score++;
    }
    // Check for wall collisions or self-collision
    if (snake.collidesWithWall() || snake.collidesWithSelf()) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        document.location.reload();
    }
}

// Start the game
window.onload = init;