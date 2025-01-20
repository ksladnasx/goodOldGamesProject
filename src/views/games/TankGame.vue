<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const gameCanvas = ref<HTMLCanvasElement | null>(null)
let gameLoop: number

interface Tank {
  x: number
  y: number
  direction: number // 0: up, 1: right, 2: down, 3: left
  bullets: Bullet[]
}

interface Bullet {
  x: number
  y: number
  direction: number
  speed: number
}

interface Enemy {
  x: number
  y: number
  direction: number
  bullets: Bullet[]
}

const player = ref<Tank>({
  x: 375,
  y: 500,
  direction: 0,
  bullets: []
})

const enemies = ref<Enemy[]>([
  { x: 100, y: 100, direction: 2, bullets: [] },
  { x: 400, y: 100, direction: 2, bullets: [] },
  { x: 700, y: 100, direction: 2, bullets: [] }
])


const score = ref(0); // 当前分数
const gameOver = ref(false); // 游戏是否结束
const maxScore = ref(0); // 最高分数



const keys = ref({
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  KeyE: false
})

onMounted(() => {
  if (gameCanvas.value) {
    const ctx = gameCanvas.value.getContext('2d')
    if (ctx) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      startGame(ctx)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  cancelAnimationFrame(gameLoop)
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.code in keys.value) {
    e.preventDefault()
    keys.value[e.code as keyof typeof keys.value] = true
  }
}

function handleKeyUp(e: KeyboardEvent) {
  if (e.code in keys.value) {
    e.preventDefault()
    keys.value[e.code as keyof typeof keys.value] = false
  }
}
import {  watch } from 'vue';
// 监听 score 的变化
watch(score, (newScore) => {
    if (newScore > maxScore.value) {
        maxScore.value = newScore;
    }
});
function drawTank(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number, isPlayer: boolean) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((direction * Math.PI) / 2)

  // Tank body
  ctx.fillStyle = isPlayer ? '#4CAF50' : '#F44336'
  ctx.fillRect(-20, -25, 40, 50)

  // Tank cannon
  ctx.fillStyle = isPlayer ? '#2E7D32' : '#B71C1C'
  ctx.fillRect(-5, -35, 10, 25)

  ctx.restore()
}

function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet) {
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2)
  ctx.fill()
}

function updateBullets(bullets: Bullet[]) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i]
    switch (bullet.direction) {
      case 0: bullet.y -= bullet.speed; break
      case 1: bullet.x += bullet.speed; break
      case 2: bullet.y += bullet.speed; break
      case 3: bullet.x -= bullet.speed; break
    }

    if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600) {
      bullets.splice(i, 1)
    }
  }
}

const enemyCount = ref(4); // 初始敌人数量为 3
function generateNewEnemies() {

  // 生成新的敌人
  for (let i = 0; i < enemyCount.value; i++) {
    const startX = 100 + (i * 20); // 每个敌人之间的起始位置间隔
     enemies.value.push({
      x: startX,
      y: 100,
      direction: 2,
      bullets: []
    });
  }

  // 增加下一次的敌人数量
  enemyCount.value += 1;
}

function checkCollisions() {
  // Check player bullets hitting enemies
  for (let i = enemies.value.length - 1; i >= 0; i--) {
    const enemy = enemies.value[i]
    for (let j = player.value.bullets.length - 1; j >= 0; j--) {
      const bullet = player.value.bullets[j]
      if (Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 25) {
        enemies.value.splice(i, 1)
        player.value.bullets.splice(j, 1)
        score.value += 100
        break
      }
    }
  }

  // Check enemy bullets hitting player
  for (const enemy of enemies.value) {
    for (let i = enemy.bullets.length - 1; i >= 0; i--) {
      const bullet = enemy.bullets[i]
      if (Math.abs(bullet.x - player.value.x) < 20 && Math.abs(bullet.y - player.value.y) < 25) {
        gameOver.value = true
        enemyCount.value = 4
        break
      }
    }
  }
  let i = ref(1)
  // 如果所有敌人都被消灭，生成新的敌人
  if (enemies.value.length === 0) {
    generateNewEnemies()
  }
}

function shoot(shooter: Tank | Enemy) {
  if (shooter.bullets.length < 3) {
    let bulletX = shooter.x
    let bulletY = shooter.y

    switch (shooter.direction) {
      case 0: bulletY -= 35; break
      case 1: bulletX += 35; break
      case 2: bulletY += 35; break
      case 3: bulletX -= 35; break
    }

    shooter.bullets.push({
      x: bulletX,
      y: bulletY,
      direction: shooter.direction,
      speed: 5
    })
  }
}

function updateEnemies() {
  for (const enemy of enemies.value) {
    // Simple AI: randomly change direction and shoot
    if (Math.random() < 0.02) {
      enemy.direction = Math.floor(Math.random() * 4)
    }
    if (Math.random() < 0.01) {
      shoot(enemy)
    }

    // Move enemy
    switch (enemy.direction) {
      case 0: enemy.y = Math.max(50, enemy.y - 2); break
      case 1: enemy.x = Math.min(750, enemy.x + 2); break
      case 2: enemy.y = Math.min(550, enemy.y + 2); break
      case 3: enemy.x = Math.max(50, enemy.x - 2); break
    }
  }
}

function startGame(ctx: CanvasRenderingContext2D) {
  function gameUpdate() {
    if (gameOver.value) {
      // Game over screen
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, 800, 600)
      ctx.fillStyle = '#fff'
      ctx.font = '48px Arial'
      ctx.fillText('游戏结束', 300, 250)
      ctx.font = '24px Arial'
      ctx.fillText(`得分: ${score.value}`, 350, 300)
      ctx.fillText(`最高分：${maxScore.value}`,350, 320)
      ctx.fillText('按空格键重新开始', 310, 370)

      if (keys.value.Space) {
        resetGame()
      }

      gameLoop = requestAnimationFrame(() => gameUpdate())
      return
    }

    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 800, 600)

    // Update player position
    if (keys.value.ArrowUp) {
      player.value.direction = 0
      player.value.y = Math.max(50, player.value.y - 3)
    }
    if (keys.value.ArrowRight) {
      player.value.direction = 1
      player.value.x = Math.min(750, player.value.x + 3)
    }
    if (keys.value.ArrowDown) {
      player.value.direction = 2
      player.value.y = Math.min(550, player.value.y + 3)
    }
    if (keys.value.ArrowLeft) {
      player.value.direction = 3
      player.value.x = Math.max(50, player.value.x - 3)
    }
    if (keys.value.Space) {
      shoot(player.value)
      keys.value.Space = false // Prevent continuous shooting
    }
    if (keys.value.KeyE) {
      shoot(player.value)
      keys.value.Space = false // Prevent continuous shooting
    }
    if (keys.value.KeyW) {
      player.value.direction = 0
      player.value.y = Math.max(50, player.value.y - 3)
    }
    if (keys.value.KeyD) {
      player.value.direction = 1
      player.value.x = Math.min(750, player.value.x + 3)
    }
    if (keys.value.KeyS) {
      player.value.direction = 2
      player.value.y = Math.min(550, player.value.y + 3)
    }
    if (keys.value.KeyA) {
      player.value.direction = 3
      player.value.x = Math.max(50, player.value.x - 3)
    }

    // Update game objects
    updateBullets(player.value.bullets)
    enemies.value.forEach(enemy => updateBullets(enemy.bullets))
    updateEnemies()
    checkCollisions()

    // Draw everything
    drawTank(ctx, player.value.x, player.value.y, player.value.direction, true)
    enemies.value.forEach(enemy => {
      drawTank(ctx, enemy.x, enemy.y, enemy.direction, false)
      enemy.bullets.forEach(bullet => drawBullet(ctx, bullet))
    })
    player.value.bullets.forEach(bullet => drawBullet(ctx, bullet))

    // Draw score
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial'
    ctx.fillText(`得分: ${score.value}`, 20, 30)
    ctx.fillText(`最高分: ${maxScore.value}`, 120, 30)

    gameLoop = requestAnimationFrame(() => gameUpdate())
  }

  gameUpdate()
}

function resetGame() {
  player.value = {
    x: 375,
    y: 500,
    direction: 0,
    bullets: []
  }
  enemies.value = [
    { x: 100, y: 100, direction: 2, bullets: [] },
    { x: 400, y: 100, direction: 2, bullets: [] },
    { x: 700, y: 100, direction: 2, bullets: [] }
  ]
  score.value = 0
  gameOver.value = false
}
</script>

<template>
  <div class="game-container">
    <h1 class="text-2xl font-bold mb-4">坦克大战</h1>
    <div class="mb-4 text-gray-600">
      使用方向键移动，空格或者E键发射子弹
    </div>
    <canvas ref="gameCanvas" width="800" height="600" class="border border-gray-300"></canvas>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>