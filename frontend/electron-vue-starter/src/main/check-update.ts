import { dialog } from 'electron';
import log from 'electron-log/main';
const { ipcMain } = require('electron')
const { autoUpdater } = require("electron-updater")




// 用户也可以通过点击按钮去检测更新
// ipcMain.on('ev-check-for-update', () => {
// 	console.log('ev-check-for-update::: 执行自动更新检查')

// 	autoUpdater.checkForUpdates()
// })


const os = require('os');

function getSystemInfo() {
    const platform = process.platform;
    let systemType = 'Unknown';

    if (platform === 'win32') {
        systemType = 'win';
    } else if (platform === 'darwin') {
        const arch = os.arch();
        systemType = arch === 'arm64' ? 'mac-arm' : 'mac-intel';
    }

    return systemType;
}

let publishUrl="" //填写远程安装包地址

let isHandle=false
export function checkUpdate(mainWindow,auto=true) {
	log.info('checkUpdate start');

	const message = {
		error: '检查更新出错',
		checking: '正在检查更新……',
		updateAva: '检测到新版本，正在下载……',
		updateNotAva: '现在使用的就是最新版本，不用更新'
	}
	autoUpdater.autoDownload = false; // 自动下载
  	autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装
	autoUpdater.setFeedURL(publishUrl) // 设置下载地址

	// 检查更新出错
	autoUpdater.on('error', (err) => {
		// console.log('autoUpdater-error:::', arguments)
		console.log("=======",err.toString(),"========")
		sendUpdateMessage(message.error+"::"+err.toString())
	})

	// 检查是否有版本更新
	autoUpdater.on('checking-for-update', () => {
		// console.log('checking-for-update:::', arguments)

		sendUpdateMessage(message.checking)
	})

	// 检测到有版本更新
	autoUpdater.on('update-available', (e) => {
		console.log("更新日志",e.releaseNotes)
		mainWindow.webContents.send('ev-new-version', {
			newVersion: e.version,
			oldVersion: autoUpdater.currentVersion.version,
			releaseNotes: e.releaseNotes
		})
		sendUpdateMessage(message.updateAva)
	})

	// 未发现有新版本
	autoUpdater.on('update-not-available', () => {
		// console.log('update-not-available:::', arguments)
		if(auto==false){
			dialog.showMessageBox({
				title: '更新提示',
				message: '当前已是最新版本',
				buttons: ['确定']
			})
		}
		sendUpdateMessage(message.updateNotAva)
	})

	// 更新下载进度事件
	autoUpdater.on('download-progress', progressObj => {
		// console.log('download-progress:::', progressObj)
		sendUpdateMessage("正在下载安装包")
		mainWindow.webContents.send('ev-update-progress',progressObj.percent / 100)
		mainWindow.setProgressBar(progressObj.percent / 100)
	})

	// 下载完成，询问用户是否更新
	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
		// console.log('update-downloaded::: 下载完成，询问用户是否更新')
		// console.log({
		// 	event,
		// 	releaseNotes,
		// 	releaseName,
		// 	releaseDate,
		// 	updateUrl,
		// 	quitAndUpdate
		// })
		sendUpdateMessage("安装包下载完成")
		mainWindow.webContents.send('ev-update-downloaded')
		// autoUpdater.quitAndInstall()
		// mainWindow.webContents.send('ev-should-update', {
		// 	event,
		// 	releaseNotes,
		// 	releaseName,
		// 	releaseDate,
		// 	updateUrl,
		// 	quitAndUpdate
		// })
	})

	if(!isHandle){
		// 监听开始下载事件
		ipcMain.on('ev-update-download', () => {
			console.log("开始下载")
			autoUpdater.downloadUpdate()
		})
		// 用户反馈立即更新
		ipcMain.on('ev-update-install', () => {
			// console.log('ev-update-now::: 用户同意更新，开始更新')
			autoUpdater.quitAndInstall()
		})
		isHandle=true
	}


	function sendUpdateMessage(text) {
		mainWindow.webContents.send('ev-message', text)
	}
	console.log("开始检查更新")
	sendUpdateMessage("开始检查更新")
	autoUpdater.checkForUpdates()
}
