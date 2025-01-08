import { ElectronAPI } from '@electron-toolkit/preload'
import { ApiInterface } from './api.d'
declare global {
  interface Window {
    electron: ElectronAPI
    api: ApiInterface
  }
}
