import './style.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { defineCustomElements } from '@telekom/scale-components/loader';
import '@telekom/scale-components/dist/scale-components/scale-components.css';

defineCustomElements();
const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');


