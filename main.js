// main.js
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

// ——— resize handler —————————————————————————————
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ——— input ——————————————————————————————————————————
class InputHandler {
  constructor() {
    this.left = this.right = this.shoot = this.restart = false;
    window.addEventListener('keydown', e => {
      if (e.code === 'ArrowLeft')  this.left = true;
      if (e.code === 'ArrowRight') this.right = true;
      if (e.code === 'Space')      this.shoot = true;
      if (e.code === 'KeyR')       this.restart = true;
    });
    window.addEventListener('keyup', e => {
      if (e.code === 'ArrowLeft')  this.left = false;
      if (e.code === 'ArrowRight') this.right = false;
      if (e.code === 'Space')      this.shoot = false;
      if (e.code === 'KeyR')       this.restart = false;
    });
  }
}

// ——— starfield —————————————————————————————————————
class Starfield {
  constructor(count = 200) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3
      });
    }
  }
  draw() {
    ctx.fillStyle = 'white';
    for (let s of this.stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
  }
}

// ——— player ——————————————————————————————————————————
class Player {
  constructor() {
    this.w     = 50;
    this.h     = 30;
    this.x     = (canvas.width - this.w)/2;
    this.y     = canvas.height - this.h - 20;
    this.speed = 400;    // px/sec (was 300)
    this.cool  = 0;      // ms
  }
  update(input, dt) {
    if (input.left )  this.x -= this.speed * dt;
    if (input.right)  this.x += this.speed * dt;
    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));

    if (input.shoot && this.cool <= 0) {
      bullets.push(new Bullet(this.x + this.w/2, this.y));
      this.cool = 300;  // cut cooldown (was 500ms)
    }
    this.cool -= dt * 1000;
  }
  draw() {
    // cyan triangle
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.h);
    ctx.lineTo(this.x + this.w/2, this.y);
    ctx.lineTo(this.x + this.w, this.y + this.h);
    ctx.closePath();
    ctx.fill();
    // outline
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }
  collides(e) {
    return !(
      this.x + this.w < e.x ||
      this.x > e.x + e.w ||
      this.y + this.h < e.y ||
      this.y > e.y + e.h
    );
  }
}

// ——— bullet ——————————————————————————————————————————
class Bullet {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = 6;            // slightly bigger
    this.speed = 600;      // px/sec (was 400)
  }
  update(dt) { this.y -= this.speed * dt; }
  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  offscreen() { return this.y < -this.r; }
  hits(e) {
    // circle-rect collision
    const nearestX = Math.max(e.x, Math.min(this.x, e.x + e.w));
    const nearestY = Math.max(e.y, Math.min(this.y, e.y + e.h));
    const dx = this.x - nearestX, dy = this.y - nearestY;
    return dx*dx + dy*dy < this.r * this.r;
  }
}

// ——— enemy ——————————————————————————————————————————
class Enemy {
  constructor(x, y, type='normal') {
    this.x = x; this.y = y; this.type = type;
    this.offset = Math.random() * 1000; // for zigzag timing
    // base size & speed & color by type
    if (type === 'big') {
      this.w = 60; this.h = 45;
      this.speed = 100 + level * 1.0;
      this.color = 'purple';
    } else if (type === 'fast') {
      this.w = 30; this.h = 20;
      this.speed = 200 + level * 2.0;
      this.color = 'orange';
    } else if (type === 'zigzag') {
      this.w = 40; this.h = 30;
      this.speed = 120 + level * 1.5;
      this.color = 'lime';
    } else {
      // normal
      this.w = 40; this.h = 30;
      this.speed = 140 + level * 1.2;
      this.color = 'magenta';
    }
    this.dir = 1; // horizontal direction
  }
  update(dt) {
    // zigzag moves up/down slightly
    if (this.type === 'zigzag') {
      this.y += Math.sin((this.offset + performance.now()) * 0.005) * 20 * dt;
    }
    this.x += this.speed * this.dir * dt;
    if (this.x <= 0 || this.x + this.w >= canvas.width) {
      this.dir *= -1;
      this.y   += this.h; // drop down a row
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    if (this.type === 'fast') {
      // draw upside-down triangle
      ctx.beginPath();
      ctx.moveTo(this.x + this.w/2, this.y);
      ctx.lineTo(this.x + this.w, this.y + this.h);
      ctx.lineTo(this.x, this.y + this.h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    } else if (this.type === 'big') {
      // draw circle
      ctx.beginPath();
      ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    } else if (this.type === 'zigzag') {
      // draw diamond
      ctx.beginPath();
      ctx.moveTo(this.x + this.w/2, this.y);
      ctx.lineTo(this.x + this.w, this.y + this.h/2);
      ctx.lineTo(this.x + this.w/2, this.y + this.h);
      ctx.lineTo(this.x, this.y + this.h/2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    } else {
      // normal rectangle
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
  }
}

// ——— game state —————————————————————————————————————
let input, stars, player, bullets, enemies;
let score, lives, level, gameOver, victory;
let lastTime;

function generateWave() {
  enemies = [];
  const cols = Math.min(4 + Math.floor(level/4), 14);
  const rows = Math.min(2 + Math.floor(level/8), 6);
  const spacingX = 20, spacingY = 20;
  const totalW = cols * 50 + (cols - 1) * spacingX;
  const startX = (canvas.width - totalW)/2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (50 + spacingX);
      const y = 50 + r * (40 + spacingY);
      // pick type with varied weights from wave 1
      const t = Math.random();
      let type = 'normal';
      if (t < 0.10)       type = 'big';
      else if (t < 0.30)  type = 'fast';
      else if (t < 0.45)  type = 'zigzag';
      enemies.push(new Enemy(x, y, type));
    }
  }
}

function drawHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, 25);
  ctx.fillText(`Lives: ${lives}`, 10, 50);
  ctx.fillText(`Level: ${level}`, 10, 75);
}

function drawGameOver() {
  ctx.fillStyle = 'red';
  ctx.font = '60px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
  ctx.font = '24px monospace';
  ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 30);
}

function drawVictory() {
  ctx.fillStyle = 'lime';
  ctx.font = '60px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YOU WIN!', canvas.width/2, canvas.height/2 - 20);
  ctx.font = '24px monospace';
  ctx.fillText('Press R to Play Again', canvas.width/2, canvas.height/2 + 30);
}

function loop(ts) {
  const dt = (ts - lastTime)/1000;
  lastTime = ts;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (gameOver) {
    drawGameOver();
    if (input.restart) init();
    else requestAnimationFrame(loop);
    return;
  }
  if (victory) {
    drawVictory();
    if (input.restart) init();
    else requestAnimationFrame(loop);
    return;
  }

  stars.draw();
  player.update(input, dt);
  player.draw();

  bullets.forEach((b,i) => {
    b.update(dt);
    if (b.offscreen()) bullets.splice(i,1);
    else {
      b.draw();
      enemies.forEach((e,j) => {
        if (b.hits(e)) {
          bullets.splice(i,1);
          enemies.splice(j,1);
          score += 10;
        }
      });
    }
  });

  let hitPlayer = false;
  enemies.forEach(e => {
    e.update(dt);
    e.draw();
    if (player.collides(e)) hitPlayer = true;
  });

  if (hitPlayer) {
    lives--;
    if (lives > 0) {
      bullets = [];
      generateWave();
    } else gameOver = true;
    requestAnimationFrame(loop);
    return;
  }

  if (enemies.length === 0) {
    if (level < 100) {
      level++;
      bullets = [];
      generateWave();
    } else victory = true;
    requestAnimationFrame(loop);
    return;
  }

  drawHUD();
  requestAnimationFrame(loop);
}

function init() {
  input    = new InputHandler();
  stars    = new Starfield(200);
  player   = new Player();
  bullets  = [];
  score    = 0;
  lives    = 3;
  level    = 1;
  gameOver = false;
  victory  = false;
  lastTime = performance.now();
  generateWave();
  requestAnimationFrame(loop);
}

init();
