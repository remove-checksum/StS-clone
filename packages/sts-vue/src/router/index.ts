import { createRouter, createWebHistory } from 'vue-router'
import GameScreen from '../views/GameScreen.vue'
import NotFound from '@/views/NotFound.vue'

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
		},
		{
			path: '/:pathMatch(.*)*',
			component: NotFound
		}
	]
})

export default router
