import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { install } from '../src/index';
import './style.css';
import 'virtual:uno.css';
import App from './App.vue';

const app = createApp(App).use(ElementPlus);
app.use(install, { global: true });
app.mount('#app');
