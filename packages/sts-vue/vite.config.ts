import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueIcons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), vueIcons({ compiler: 'vue3' })],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
