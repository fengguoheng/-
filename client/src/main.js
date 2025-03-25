import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import { createPinia } from 'pinia';
// 全局配置（如 main.js）
import axios from 'axios';
axios.defaults.withCredentials = true;
const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ElementPlus);

app.mount('#app');