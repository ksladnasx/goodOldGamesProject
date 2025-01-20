<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

document.title = '首页 - GoodOldGames';
const router = useRouter()

const games = ref([
  {
    id: 'tank',
    name: '坦克大战',
    description: '经典的坦克对战游戏',
    icon: '🎮'
  },
  {
    id: 'snake',
    name: '贪吃蛇',
    description: '永不过时的贪吃蛇游戏',
    icon: '🐍'
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    description: '考验技巧的俄罗斯方块',
    icon: '🎲'
  }
])

const navigateToGame = (gameId: string) => {
  router.push(`/${gameId}`)
}
</script>
<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8">经典游戏合集</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="game in games"
          :key="game.id"
          class="bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition-transform hover:scale-105"
          @click="navigateToGame(game.id)"
        >
          <div class="text-4xl mb-4">{{ game.icon }}</div>
          <h2 class="text-2xl font-bold mb-2">{{ game.name }}</h2>
          <p class="text-gray-600">{{ game.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
*{
  font-family: 'Times New Roman', Times, serif;
}
</style>