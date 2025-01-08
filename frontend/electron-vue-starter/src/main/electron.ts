import { electronApp, optimizer } from "@electron-toolkit/utils"
import { app, net, protocol } from "electron"
import icon from '../../resources/icon.png?asset'
import log from 'electron-log/main';
import path from "path"

export function initialApp(){
	return new Promise(async (resolve, reject) =>{
		log.initialize();
		log.transports.file.level = 'error';
		log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs/main.log');
		// 捕获并记录主进程中的异常
		process.on('uncaughtException', (error) => {
			log.error('Exception in main process: ', error);
		});
		process.on('unhandledRejection', (reason) => {
			log.error('unhandledRejection Exception in main process: ', reason);
		});

		app.whenReady().then(() => {
			electronApp.setAppUserModelId('com.spritedance.caidan')

			// Default open or close DevTools by F12 in development
			// and ignore CommandOrControl + R in production.
			// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
			app.on('browser-window-created', (_, window) => {
				optimizer.watchWindowShortcuts(window)
			})

			app.on('window-all-closed', () => {
				// if (process.platform !== 'darwin') {
				// 	app.quit()
				// }
				app.quit()
			})

			if (process.platform === 'darwin') {
				app.dock.setIcon(icon);
			}

			protocol.handle('app', async (request) => {
				const reqPath=request.url.slice('app:///'.length)

				return net.fetch(`file://${reqPath}`);
			})

			resolve(null)
		})

		app.on('before-quit', () => {
			//应用程序退出前
			console.log("应用程序退出前")
			if(process.platform== 'darwin'){
				const { exec } = require('child_process');
				exec('killall qdrant_darwin_arm64')
				exec('killall qdrant_darwin_x64')
			}
		})
	})
}
