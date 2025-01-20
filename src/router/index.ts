import { createRouter, createWebHistory } from 'vue-router'
import GameSelection from '../views/GameSelection.vue'
import TankGame from '../views/games/TankGame.vue'
import SnakeGame from '../views/games/SnakeGame.vue'
import TetrisGame from '../views/games/TetrisGame.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameSelection
    },
    {
      path: '/tank',
      name: 'tank',
      component: TankGame
    },
    {
      path: '/snake',
      name: 'snake',
      component: SnakeGame
    },
    {
      path: '/tetris',
      name: 'tetris',
      component: TetrisGame
    }
  ]
})

export default router