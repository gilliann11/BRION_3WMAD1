const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const pauseBtn = document.getElementById('pauseBtn');
const losePopup = document.getElementById('losePopup');
const finalScoreSpan = document.getElementById('finalScore');

let difficultySettings = { easy: 2000, normal: 1000, hard: 500 };
let enemySpawnRate = 1000;
let eliminationLineOffset = 10;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - eliminationLineOffset;
}
window.addEventListener('resize', resizeCanvas);

const playerImage = new Image();
playerImage.src = '1.jpg';

let player = { x: 0, y: 0, width: 60, height: 60, speed: 20 };
let bullets = [];
let enemies = [];
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let gameStarted = false;
let paused = false;
let gameOver = false;

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));
}

function drawEnemies() {
  ctx.fillStyle = 'red';
  enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));
}

function moveBullets() {
  bullets.forEach(bullet => bullet.y -= bullet.speed);
  bullets = bullets.filter(bullet => bullet.y > 0);
}

function moveEnemies() {
  enemies.forEach(enemy => enemy.y += enemy.speed);
  enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

function createEnemy() {
  if (gameStarted && !paused && !gameOver) {
    const x = Math.random() * (canvas.width - 40);
    enemies.push({ x, y: 0, width: 40, height: 20, speed: 3 });
  }
}

function detectCollisions() {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score++;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
        }
      }
    });
  });

  enemies.forEach(enemy => {
    if (enemy.y + enemy.height >= player.y) {
      endGame();
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  ctx.fillText('High Score: ' + highScore, 10, 60);
}

function endGame() {
  gameOver = true;
  gameStarted = false;
  paused = true;
  finalScoreSpan.textContent = score;
  losePopup.style.display = 'flex';
}

function reloadGame() {
  window.location.reload();
}

function gameLoop() {
  if (gameStarted && !paused && !gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();

    moveBullets();
    moveEnemies();
    detectCollisions();
  }
  requestAnimationFrame(gameLoop);
}

function startGame(level) {
  enemySpawnRate = difficultySettings[level];
  startScreen.style.display = 'none';
  canvas.style.display = 'block';
  pauseBtn.style.display = 'block';
  resizeCanvas();
  gameStarted = true;
  score = 0;
  enemies = [];
  bullets = [];
  gameOver = false;
  setInterval(createEnemy, enemySpawnRate);
}

function togglePause() {
  if (gameStarted && !gameOver) {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  }
}

document.addEventListener('keydown', (e) => {
  if (gameStarted && !paused && !gameOver) {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
    if (e.key === ' ') bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, speed: 12 });
  }
});

playerImage.onload = () => {
  resizeCanvas();
  gameLoop();
};
