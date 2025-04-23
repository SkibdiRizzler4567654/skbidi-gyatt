// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Player
let player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 50,
  height: 60,
  speed: 5,
  health: 100,
  color: 'green',
  score: 0
};

// Enemy
let enemies = [];
let enemySpeed = 2;
let enemySpawnRate = 50; // Spawn every 50 frames
let frames = 0;

// Handle player movement
let keys = { left: false, right: false, up: false, down: false };

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === 'ArrowUp') keys.up = true;
  if (e.key === 'ArrowDown') keys.down = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === 'ArrowUp') keys.up = false;
  if (e.key === 'ArrowDown') keys.down = false;
});

// Player movement
function movePlayer() {
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y < canvas.height - player.height) player.y += player.speed;
}

// Create enemies
function spawnEnemies() {
  if (frames % enemySpawnRate === 0) {
    let x = Math.random() * (canvas.width - 50);
    let y = -50; // Start above the canvas
    enemies.push({ x, y, width: 50, height: 50, color: 'red' });
  }
}

// Update enemy positions
function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemySpeed;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      player.score++;
    }
  }
}

// Collision detection
function checkCollisions() {
  for (let i = 0; i < enemies.length; i++) {
    if (player.x < enemies[i].x + enemies[i].width &&
        player.x + player.width > enemies[i].x &&
        player.y < enemies[i].y + enemies[i].height &&
        player.y + player.height > enemies[i].y) {
      player.health -= 10;
      enemies.splice(i, 1);
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw enemies
  for (let enemy of enemies) {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
  
  // Draw health
  ctx.fillStyle = 'black';
  ctx.fillText(`Health: ${player.health}`, 10, 30);
  
  // Draw score
  ctx.fillText(`Score: ${player.score}`, canvas.width - 100, 30);
  
  // Game over if health is 0
  if (player.health <= 0) {
    ctx.fillText('GAME OVER', canvas.width / 2 - 60, canvas.height / 2);
    return;
  }

  frames++;
  movePlayer();
  spawnEnemies();
  moveEnemies();
  checkCollisions();
  
  requestAnimationFrame(draw);
}

draw();
