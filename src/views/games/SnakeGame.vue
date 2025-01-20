<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const gameCanvas = ref<HTMLCanvasElement | null>(null)
let gameLoop: number

interface Position {
  x: number
  y: number
}

const gridSize = 20
const snake = ref<Position[]>([{ x: 10, y: 10 }])
const direction = ref<Position>({ x: 1, y: 0 })
const food = ref<Position>({ x: 15, y: 15 })
const score = ref(0)
const gameOver = ref(false)
const gameSpeed = ref(150)
let lastUpdate = 0

onMounted(() => {
  if (gameCanvas.value) {
    const ctx = gameCanvas.value.getContext('2d')
    if (ctx) {
      window.addEventListener('keydown', handleKeyPress)
      startGame(ctx)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  cancelAnimationFrame(gameLoop)
})

function handleKeyPress(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      if (direction.value.y === 0) direction.value = { x: 0, y: -1 }
      break
    case 'ArrowDown':
    case 's':
      if (direction.value.y === 0) direction.value = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
    case 'a':
      if (direction.value.x === 0) direction.value = { x: -1, y: 0 }
      break
    case 'ArrowRight':
    case 'd':
      if (direction.value.x === 0) direction.value = { x: 1, y: 0 }
      break
    case ' ':
    case 'e':
      if (gameOver.value) resetGame()
      break
    
  }
}

function generateFood() {
  const maxX = Math.floor(800 / gridSize)
  const maxY = Math.floor(600 / gridSize)
  
  while (true) {
    const newFood = {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    }
    
    // Check if food spawns on snake
    if (!snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      food.value = newFood
      break
    }
  }
}

function checkCollision(head: Position): boolean {
  // Wall collision
  if (head.x < 0 || head.x >= 800 / gridSize || head.y < 0 || head.y >= 600 / gridSize) {
    return true
  }
  
  // Self collision
  return snake.value.some(segment => segment.x === head.x && segment.y === head.y)
}

function updateGame() {
  const head = { ...snake.value[0] }
  head.x += direction.value.x
  head.y += direction.value.y
  
  if (checkCollision(head)) {
    gameOver.value = true
    return
  }
  
  snake.value.unshift(head)
  
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    gameSpeed.value = Math.max(50, gameSpeed.value - 5)
    generateFood()
  } else {
    snake.value.pop()
  }
}

function drawGame(ctx: CanvasRenderingContext2D) {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, 800, 600)
  
  // Draw grid
  ctx.strokeStyle = '#333'
  for (let i = 0; i < 800; i += gridSize) {
    for (let j = 0; j < 600; j += gridSize) {
      ctx.strokeRect(i, j, gridSize, gridSize)
    }
  }
  
  // Draw snake
  snake.value.forEach((segment, index) => {
    const gradient = ctx.createLinearGradient(
      segment.x * gridSize,
      segment.y * gridSize,
      (segment.x + 1) * gridSize,
      (segment.y + 1) * gridSize
    )
    gradient.addColorStop(0, '#4CAF50')
    gradient.addColorStop(1, '#2E7D32')
    
    ctx.fillStyle = gradient
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 1,
      gridSize - 1
    )
    
    // Draw snake eyes
    if (index === 0) {
      ctx.fillStyle = '#fff'
      const eyeSize = 4
      const eyeOffset = 5
      
      // Position eyes based on direction
      if (direction.value.x !== 0) {
        ctx.fillRect(
          segment.x * gridSize + (direction.value.x > 0 ? gridSize - 8 : 4),
          segment.y * gridSize + eyeOffset,
          eyeSize,
          eyeSize
        )
        ctx.fillRect(
          segment.x * gridSize + (direction.value.x > 0 ? gridSize - 8 : 4),
          segment.y * gridSize + gridSize - eyeOffset - eyeSize,
          eyeSize,
          eyeSize
        )
      } else {
        ctx.fillRect(
          segment.x * gridSize + eyeOffset,
          segment.y * gridSize + (direction.value.y > 0 ? gridSize - 8 : 4),
          eyeSize,
          eyeSize
        )
        ctx.fillRect(
          segment.x * gridSize + gridSize - eyeOffset - eyeSize,
          segment.y * gridSize + (direction.value.y > 0 ? gridSize - 8 : 4),
          eyeSize,
          eyeSize
        )
      }
    }
  })
  
  // Draw food
  const foodX = food.value.x * gridSize
  const foodY = food.value.y * gridSize
  ctx.fillStyle = '#F44336'
  ctx.beginPath()
  ctx.arc(
    foodX + gridSize / 2,
    foodY + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  )
  ctx.fill()
  
  // Draw score
  ctx.fillStyle = '#fff'
  ctx.font = '20px Arial'
  ctx.fillText(`得分: ${score.value}`, 20, 30)
  
  if (gameOver.value) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, 800, 600)
    
    ctx.fillStyle = '#fff'
    ctx.font = '48px Arial'
    ctx.fillText('游戏结束', 300, 250)
    ctx.font = '24px Arial'
    ctx.fillText(`最终得分: ${score.value}`, 330, 300)
    ctx.fillText('按空格键重新开始', 310, 350)
  }
}

function startGame(ctx: CanvasRenderingContext2D) {
  function gameUpdate(timestamp: number) {
    if (timestamp - lastUpdate > gameSpeed.value) {
      if (!gameOver.value) {
        updateGame()
      }
      lastUpdate = timestamp
    }
    
    drawGame(ctx)
    gameLoop = requestAnimationFrame(gameUpdate)
  }
  
  gameUpdate(0)
}

function resetGame() {
  snake.value = [{ x: 10, y: 10 }]
  direction.value = { x: 1, y: 0 }
  generateFood()
  score.value = 0
  gameSpeed.value = 150
  gameOver.value = false
}
</script>

<template>
  <div class="game-container">
    <h1 class="text-2xl font-bold mb-4">贪吃蛇</h1>
    <div class="mb-4 text-gray-600">
      使用方向键控制蛇的移动
    </div>
    <canvas
      ref="gameCanvas"
      width="800"
      height="600"
      class="border border-gray-300"
    ></canvas>
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