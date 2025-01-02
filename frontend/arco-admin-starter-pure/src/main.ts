import { createApp } from 'vue'
import App from './App.vue'
import {router} from './routes'
import '@arco-design/web-vue/dist/arco.css';
import './base.css'
import './theme.scss'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { createPinia } from 'pinia';
import permissions from './directives/permission';

const pinia = createPinia()
createApp(App)
.use(pinia)
.use(router)
.use(ArcoVueIcon)
.directive('permissions', permissions)
.mount('#app')
