import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/element-variables.scss';

declare global {
  interface Window {
    oauth2Callback: (uri: string) => void
  }
}

createApp(App)
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app');
