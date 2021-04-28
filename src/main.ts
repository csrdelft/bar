import { createApp } from 'vue';
import axios from 'axios';
import csrAuth from '@/auth/csrAuth';
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

/**
 * Wordt aangeroepen vanuit een popup in /auth/callback.
 * @param uri
 */
window.oauth2Callback = (uri: string) => {
  csrAuth.token.getToken(uri)
    .then((token) => {
      store.commit('setToken', token);

      return axios(token.sign({
        method: 'get' as const,
        url: `${process.env.VUE_APP_REMOTE_URL}/api/v3/profiel`,
      }))
        .then((res) => store.commit('setProfiel', res.data));
    });
};

createApp(App)
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app');
