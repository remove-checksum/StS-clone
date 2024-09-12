import { createRouter, createWebHistory } from 'vue-router'
import GameScreen from '../views/GameScreen.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/game'
		},
		{
			path: '/game',
			component: GameScreen
		}
	]
})

export default router
