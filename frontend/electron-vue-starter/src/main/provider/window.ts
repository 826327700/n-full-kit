import { BrowserWindow } from "electron/main"

export class WindowsProvider {
	// 全局窗口管理变量
	public static windows: Map<string, BrowserWindow>=new Map<string, BrowserWindow>();
}
