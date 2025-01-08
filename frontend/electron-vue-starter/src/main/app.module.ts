import { Module, OnModuleInit } from '@nestjs/common';
import { app, shell, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { AutoBinding } from './auto.binding';
import { TestModule } from './modules/test/test.module'
import log from 'electron-log/main';
import { WindowsProvider } from './provider/window';
import { checkUpdate } from './check-update';

@Module({
	imports:[
		AutoBinding,
		TestModule
	],
})
export class AppModule implements OnModuleInit {

	onModuleInit() {
		log.info('AppModule start');
		this.createMainWindow()
	}

	createMainWindow(){
		const mainWindow = new BrowserWindow({
			width: 1420,
			height: 960,
			minWidth: 1420,
			minHeight: 960,
			show: false,
			autoHideMenuBar: true,
			frame:false,
			titleBarStyle: 'hidden',
			// fullscreen:true,
			// titleBarOverlay: {
			// 	color :"rgba(0,0,0,0.1)",
			// },
			// ...(process.platform === 'linux' ? { icon } : {}),
			icon:icon,
			webPreferences: {
				preload: join(__dirname, '../preload/index.js'),
				sandbox: false,
				devTools: !app.isPackaged,
			}
		})
		// mainWindow.maximize()

		mainWindow.on('ready-to-show', () => {
			mainWindow.show()
			checkUpdate(mainWindow)
		})

		mainWindow.webContents.on('did-finish-load', () => {
			mainWindow.webContents.executeJavaScript(`window.platform="${process.platform}"`)
			mainWindow.webContents.executeJavaScript(`window.version="${app.getVersion()}"`)
			mainWindow.webContents.executeJavaScript(`window.mainWindow=true`)
		})

		mainWindow.webContents.setWindowOpenHandler((details) => {
			shell.openExternal(details.url)
			return { action: 'deny' }
		})

		// HMR for renderer base on electron-vite cli.
		// Load the remote URL for development or the local html file for production.
		if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
			mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
		} else {
			mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
		}

		WindowsProvider.windows.set("main",mainWindow)
	}


}
