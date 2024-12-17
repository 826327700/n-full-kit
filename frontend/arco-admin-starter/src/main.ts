import { createApp } from 'vue'
import './base.css'
import './theme.scss'
import App from './App.vue'
import {router} from './routes'
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

createApp(App).use(router).use(ArcoVueIcon).mount('#app')
