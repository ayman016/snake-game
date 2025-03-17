const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');
const loseSound = document.getElementById('loseSound');
const eatSound = document.getElementById('eatSound');

const gridSize = 20;
const tileCount = 20;

const snakeImg = new Image();
snakeImg.src = 'snake.png';
let imageLoaded = false;

snakeImg.onload = function() {
    imageLoaded = true;
};

const INITIAL_SPEED = 200; // Slower initial speed (higher number = slower)
const MIN_SPEED = 50;     // Maximum speed (lower number = faster)
const SPEED_INCREMENT = 2; // How much to increase speed per score point

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let isPaused = false;
let lastDirection = { dx: 0, dy: 0 };

const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (lastDirection.dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (lastDirection.dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (lastDirection.dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (lastDirection.dx !== -1) { dx = 1; dy = 0; }
            break;
        case ' ':  // Spacebar for pause
            isPaused = !isPaused;
            break;
    }
});

upBtn.addEventListener('click', () => {
    if (lastDirection.dy !== 1) { dx = 0; dy = -1; }
});

downBtn.addEventListener('click', () => {
    if (lastDirection.dy !== -1) { dx = 0; dy = 1; }
});

leftBtn.addEventListener('click', () => {
    if (lastDirection.dx !== 1) { dx = -1; dy = 0; }
});

rightBtn.addEventListener('click', () => {
    if (lastDirection.dx !== -1) { dx = 1; dy = 0; }
});

// Add touch events for mobile support
[upBtn, downBtn, leftBtn, rightBtn].forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        btn.click();
    });
});

function startGame() {
    if (!imageLoaded) {
        alert('Please wait for images to load...');
        return;
    }
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, INITIAL_SPEED);
}

function updateGameSpeed() {
    const newSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score * SPEED_INCREMENT));
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, newSpeed);
}

function gameLoop() {
    if (isPaused) return;
    
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Update last direction
    if (dx !== 0 || dy !== 0) {
        lastDirection = { dx, dy };
    }

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        clearInterval(gameInterval);
        handleGameOver();
        return;
    }

    // Check self collision (excluding the current head position)
    if (snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameInterval);
        handleGameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        eatSound.currentTime = 0; // Reset sound to start
        eatSound.play();
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
        updateGameSpeed(); // Add this line to update speed when score increases
    } else {
        snake.pop();
    }

    draw();
}

function handleGameOver() {
    loseSound.play();
    loseSound.onended = function() {
        alert('khserty azbi hhhhhhh malk wash 3war hhhh: ' + score);
    };
}

function getRotationAngle(dx, dy) {
    if (dx === 1) return 0;
    if (dx === -1) return Math.PI;
    if (dy === 1) return Math.PI/2;
    if (dy === -1) return -Math.PI/2;
    return 0;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.save();
        // Calculate center position for rotation
        const centerX = segment.x * gridSize + (gridSize-2)/2;
        const centerY = segment.y * gridSize + (gridSize-2)/2;
        
        ctx.translate(centerX, centerY);
        // Rotate head based on direction, other segments follow previous direction
        const rotation = index === 0 ? getRotationAngle(dx, dy) : getRotationAngle(
            snake[index-1].x - segment.x,
            snake[index-1].y - segment.y
        );
        ctx.rotate(rotation);
        
        // Draw slightly larger segments
        const size = gridSize * 1.2;
        ctx.drawImage(snakeImg, -size/2, -size/2, size, size);
        ctx.restore();
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}
