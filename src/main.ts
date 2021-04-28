import { createApp } from 'vue';
import csrAuth from '@/auth/csrAuth';
import App from './App.vue';
import router from './router';
import store from './store';

declare global {
  interface Window {
    oauth2Callback: (uri: string) => void
  }
}

window.oauth2Callback = (uri: string) => {
  csrAuth.token.getToken(uri)
    .then((user) => {
      store.commit('setUser', user);

      // Make a request to the github API for the current user.
      const {
        url,
        ...args
      } = user.sign({
        method: 'get',
        url: `${process.env.VUE_APP_REMOTE_URL}/api/v3/profiel`,
      });

      return fetch(url, args)
        .then((res) => res.json())
        .then((res) => store.commit('setProfiel', res));
    });
};

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
