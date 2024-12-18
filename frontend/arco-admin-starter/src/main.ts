import { createApp } from 'vue'
import App from './App.vue'
import {router} from './routes'
import '@arco-design/web-vue/dist/arco.css';
import './base.css'
import './theme.scss'

import ArcoVueIcon from '@arco-design/web-vue/es/icon';

createApp(App).use(router).use(ArcoVueIcon).mount('#app')
