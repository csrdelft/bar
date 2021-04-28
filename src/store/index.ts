import { createStore } from 'vuex';
import { Persoon, Profiel } from '@/model';
import { Data, Token } from 'client-oauth2';
import axios, { AxiosResponse } from 'axios';
import VuexPersist from 'vuex-persist';
import csrAuth from '@/auth/csrAuth';

const vuexLocalStorage = new VuexPersist<{token: Data|null}>({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  reducer: ({ token }) => ({ token }),
  // Function that passes a mutation and lets you decide
  // if it should update the state in localStorage.
  // filter: mutation => (true)
});

export default createStore({
  plugins: [vuexLocalStorage.plugin],
  state: {
    profiel: null as Profiel | null,
    token: null as Data | null,
    personen: [] as Persoon[],
  },
  mutations: {
    setProfiel(state, profiel: Profiel) {
      state.profiel = profiel;
    },
    setUser(state, token: Token) {
      state.token = token.data;
    },
    setPersonen(state, personen: Persoon[]) {
      state.personen = personen;
    },
  },
  actions: {
    listUsers({
      state,
      commit,
    }): void {
      if (!state.token) throw new Error('Geen token');

      const token = new Token(csrAuth, state.token);

      axios(token.sign({
        url: `${process.env.VUE_APP_REMOTE_URL}/api/v3/bar/personen`,
        method: 'POST' as const,
      }))
        .then((response: AxiosResponse<Persoon[]>) => {
          console.log(Object.values(response.data));
          commit('setPersonen', Object.values(response.data));
        });
    },
  },
  modules: {},
});
