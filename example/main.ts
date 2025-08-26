import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import { install } from '../src/index';
import App from './App.vue';
import 'element-plus/dist/index.css';
import './style.css';
import 'virtual:uno.css';

const app = createApp(App).use(ElementPlus);
app.use(install, { global: true });
app.mount('#app');
