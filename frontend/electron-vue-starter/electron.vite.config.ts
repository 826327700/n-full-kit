import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin,swcPlugin,bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin(),swcPlugin(),bytecodePlugin()]
	},
	preload: {
		plugins: [externalizeDepsPlugin(),bytecodePlugin()]
	},
	renderer: {
		resolve: {
		alias: {
			'@': resolve('src/renderer/src')
		}
		},
		plugins: [vue()]
	}
})
