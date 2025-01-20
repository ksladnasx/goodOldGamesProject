<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
//设置标签页标题
document.title = '俄罗斯方块';

const gameCanvas = ref<HTMLCanvasElement | null>(null)
let gameLoop: number

const BLOCK_SIZE = 30
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

interface Block {
  x: number
  y: number
}

interface Tetromino {
  blocks: Block[]
  color: string
}

const board = ref<string[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')))
const currentPiece = ref<Tetromino | null>(null)
const score = ref(0)
const gameOver = ref(false)
const level = ref(1)
const dropInterval = ref(1000)
let lastDrop = 0

const TETROMINOES = [
  { // I
    blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
    color: '#00f0f0'
  },
  { // O
    blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    color: '#f0f000'
  },
  { // T
    blocks: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    color: '#a000f0'
  },
  { // S
    blocks: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    color: '#00f000'
  },
  { // Z
    blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    color: '#f00000'
  },
  { // J
    blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    color: '#0000f0'
  },
  { // L
    blocks: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    color: '#f0a000'
  }
]

onMounted(() => {
  if (gameCanvas.value) {
    const ctx = gameCanvas.value.getContext('2d')
    if (ctx) {
      window.addEventListener('keydown', handleKeyPress)
      spawnNewPiece()
      startGame(ctx)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  cancelAnimationFrame(gameLoop)
})

function handleKeyPress(event: KeyboardEvent) {
  if (gameOver.value) {
    if (event.key === ' ') resetGame()
    return
  }
  
  switch (event.key) {
    case 'ArrowLeft':
    case "a":
      movePiece(-1, 0)
      break
    case 'ArrowRight':
    case "d":
      movePiece(1, 0)
      break
    case 'ArrowDown':
    case "s":
      movePiece(0, 1)
      break
    case 'ArrowUp':
    case "w":
      rotatePiece()
      break
    case ' ':
    case 'e':
      hardDrop()
      break
  }
}

function spawnNewPiece() {
  const pieceType = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
  currentPiece.value = {
    blocks: pieceType.blocks.map(block => ({ x: block.x + 3, y: block.y })),
    color: pieceType.color
  }
  
  if (!isValidMove(currentPiece.value.blocks)) {
    gameOver.value = true
  }
}

function isValidMove(blocks: Block[]): boolean {
  return blocks.every(block => {
    return block.x >= 0 &&
           block.x < BOARD_WIDTH &&
           block.y >= 0 &&
           block.y < BOARD_HEIGHT &&
           !board.value[block.y]?.[block.x]
  })
}

function movePiece(dx: number, dy: number): boolean {
  if (!currentPiece.value) return false
  
  const newBlocks = currentPiece.value.blocks.map(block => ({
    x: block.x + dx,
    y: block.y + dy
  }))
  
  if (isValidMove(newBlocks)) {
    currentPiece.value.blocks = newBlocks
    return true
  }
  
  if (dy > 0) {
    placePiece()
    return false
  }
  
  return false
}

function rotatePiece() {
  if (!currentPiece.value) return
  
  const center = currentPiece.value.blocks[1]
  const newBlocks = currentPiece.value.blocks.map(block => ({
    x: center.x - (block.y - center.y),
    y: center.y + (block.x - center.x)
  }))
  
  if (isValidMove(newBlocks)) {
    currentPiece.value.blocks = newBlocks
  }
}

function hardDrop() {
  while (movePiece(0, 1)) {}
}

function placePiece() {
  if (!currentPiece.value) return
  
  currentPiece.value.blocks.forEach(block => {
    board.value[block.y][block.x] = currentPiece.value!.color
  })
  
  clearLines()
  spawnNewPiece()
}

function clearLines() {
  let linesCleared = 0
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board.value[y].every(cell => cell)) {
      board.value.splice(y, 1)
      board.value.unshift(Array(BOARD_WIDTH).fill(''))
      linesCleared++
      y++
    }
  }
  
  if (linesCleared > 0) {
    score.value += [0, 100, 300, 500, 800][linesCleared] * level.value
    level.value = Math.floor(score.value / 1000) + 1
    dropInterval.value = Math.max(100, 1000 - (level.value - 1) * 100)
  }
}

function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const gradient = ctx.createLinearGradient(
    x * BLOCK_SIZE,
    y * BLOCK_SIZE,
    (x + 1) * BLOCK_SIZE,
    (y + 1) * BLOCK_SIZE
  )
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, adjustColor(color, -30))
  
  ctx.fillStyle = gradient
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1)
  
  // Highlight
  ctx.strokeStyle = adjustColor(color, 50)
  ctx.beginPath()
  ctx.moveTo(x * BLOCK_SIZE, (y + 1) * BLOCK_SIZE - 1)
  ctx.lineTo(x * BLOCK_SIZE, y * BLOCK_SIZE)
  ctx.lineTo((x + 1) * BLOCK_SIZE - 1, y * BLOCK_SIZE)
  ctx.stroke()
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function drawGame(ctx: CanvasRenderingContext2D) {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE)
    // Draw score and level
    ctx.fillStyle = '#ff0'; // 使用黄色字体
  ctx.font = '20px Arial'
  ctx.fillText(`得分: ${score.value}`, 10, 20); // 距离左上角 10px, 20px 的位置
  ctx.fillText(`等级: ${level.value}`, 10, 40); // 距离左上角 10px, 40px 的位置

  // Draw board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board.value[y][x]) {
        drawBlock(ctx, x, y, board.value[y][x])
      }
    }
  }
  
  // Draw current piece
  if (currentPiece.value) {
    currentPiece.value.blocks.forEach(block => {
      drawBlock(ctx, block.x, block.y, currentPiece.value!.color)
    })
  }
  
  // Draw grid
  ctx.strokeStyle = '#333'
  for (let i = 0; i <= BOARD_WIDTH; i++) {
    ctx.beginPath()
    ctx.moveTo(i * BLOCK_SIZE, 0)
    ctx.lineTo(i * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE)
    ctx.stroke()
  }
  for (let i = 0; i <= BOARD_HEIGHT; i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * BLOCK_SIZE)
    ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, i * BLOCK_SIZE)
    ctx.stroke()
  }
  
  

  
  if (gameOver.value) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE)
    
    ctx.fillStyle = '#fff'
    ctx.font = '48px Arial'
    ctx.fillText('游戏结束', 50, 250)
    ctx.font = '24px Arial'
    ctx.fillText(`最终得分: ${score.value}`, 80, 300)
    ctx.fillText('按空格键重新开始', 60, 350)
  }
}

function startGame(ctx: CanvasRenderingContext2D) {
  function gameUpdate(timestamp: number) {
    if (!gameOver.value && timestamp - lastDrop > dropInterval.value) {
      movePiece(0, 1)
      lastDrop = timestamp
    }
    
    drawGame(ctx)
    gameLoop = requestAnimationFrame(gameUpdate)
  }
  
  gameUpdate(0)
}

function resetGame() {
  board.value = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  score.value = 0
  level.value = 1
  dropInterval.value = 1000
  gameOver.value = false
  spawnNewPiece()
}
</script>

<template>
  <div class="game-container">
    <h1 class="text-2xl font-bold mb-4">俄罗斯方块</h1>
    <div class="mb-4 text-gray-600">
      使用方向键移动和旋转，空格键快速下落
    </div>
    <br>
    <canvas
      ref="gameCanvas"
      width="300"
      height="600"
      class="border border-gray-300"
    ></canvas>
  </div>
  <div>
    <a href="http://localhost:5174/">返回主页</a>
  </div>
</template>

<style scoped>
*{
  font-family: 'Times New Roman', Times, serif;
}
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>