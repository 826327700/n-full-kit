import { ElectronAPI } from '@electron-toolkit/preload'
import { ExportInterface } from "./export.d"
declare global {
  interface Window {
    electron: ElectronAPI
    api: ExportInterface
  }
}
