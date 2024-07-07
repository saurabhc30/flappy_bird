const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird, background, pipeImg;
let birdX, birdY, birdRadius;
let gravity, velocity, jumpStrength;
let pipes, pipeWidth, pipeGap, pipeFrequency, lastPipe;
let score;
let gameOver;
let frameCount;

// Initialize game
function init() {
    bird = new Image();
    bird.src = 'bird.png';

    background = new Image();
    background.src = 'background.png';

    pipeImg = new Image();
    pipeImg.src = 'pipe.png';

    birdX = 50;
    birdY = canvas.height / 2;
    birdRadius = 20;
    gravity = 0.6;
    velocity = 0;
    jumpStrength = -12;
    pipes = [];
    pipeWidth = 50;
    pipeGap = 200;
    pipeFrequency = 90;
    lastPipe = 0;
    score = 0;
    gameOver = false;
    frameCount = 0;
}

// Event listener for jumping
document.addEventListener('keydown', jump);
canvas.addEventListener('touchstart', jump);

function jump(event) {
    if (event.type === 'keydown' && event.code === 'Space' && !gameOver) {
        velocity = jumpStrength;
    } else if (event.type === 'touchstart' && !gameOver) {
        velocity = jumpStrength;
    }
}

// Function to draw the bird
function drawBird() {
    ctx.drawImage(bird, birdX - birdRadius, birdY - birdRadius, birdRadius * 2, birdRadius * 2);
}

// Function to draw background
function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Function to draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - pipe.topHeight - pipeGap);
    });
}

// Function to update bird position
function updateBird() {
    velocity += gravity;
    birdY += velocity;

    if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
        gameOver = true;
    }
}

// Function to update pipe positions and check collisions
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (birdX + birdRadius > pipe.x && birdX - birdRadius < pipe.x + pipeWidth) {
            if (birdY - birdRadius < pipe.topHeight || birdY + birdRadius > pipe.topHeight + pipeGap) {
                gameOver = true;
            }
        }

        if (pipe.x + pipeWidth < birdX - birdRadius && !pipe.passed) {
            pipe.passed = true;
            score++;
        }
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Function to generate pipes
function generatePipes() {
    if (frameCount % pipeFrequency === 0) {
        let topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, topHeight: topHeight, passed: false });
    }
}

// Function to draw score
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();
        updateBird();
        updatePipes();
        generatePipes();

        drawPipes();
        drawBird();
        drawScore();

        frameCount++;
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 20);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 20);
        document.getElementById('restartButton').style.display = 'block'; // Display the restart button
    }
}

// Function to restart the game
function restartGame() {
    document.getElementById('restartButton').style.display = 'none'; // Hide the restart button
    init();
    gameLoop();
}

// Initialize the game
init();
gameLoop();
