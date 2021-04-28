import { createStore } from 'vuex';
import { Persoon, Product, Profiel } from '@/model';
import { Data, Token } from 'client-oauth2';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import VuexPersist from 'vuex-persist';
import csrAuth from '@/auth/csrAuth';
import { throwError } from '@/util';

const vuexLocalStorage = new VuexPersist<{ token: Data | null }>({
  key: 'vuex',
  storage: window.localStorage,
  // Alleen token opslaan in localStorage
  reducer: ({ token }) => ({ token }),
});

/**
 * Deze variant van fetch stopt de token in iedere request en gooit de token weg als er iets
 * mis gaat.
 * @param state
 * @param commit
 */
const getFetch = (state: { token: Data | null }, commit: (action: string) => unknown) => {
  const token = (state.token ? new Token(csrAuth, state.token) : throwError('Geen token'));

  return <T>(requestObj: AxiosRequestConfig & { url: string }): AxiosPromise<T> => axios(
    token.sign({
      ...requestObj,
      url: process.env.VUE_APP_REMOTE_URL + requestObj.url,
    }),
  )
    .catch((response) => {
      // TODO, response is eigenlijk niet AxiosResponse<T>
      commit('invalidateToken');
      return response;
    });
};

export default createStore({
  plugins: [vuexLocalStorage.plugin],
  state: () => ({
    zoeken: '',
    profiel: null as Profiel | null,
    token: null as Data | null,
    personen: [] as Persoon[],
    producten: [] as Product[],
  }),
  mutations: {
    setZoeken(state, value: string) {
      state.zoeken = value;
    },
    setProfiel(state, profiel: Profiel) {
      state.profiel = profiel;
    },
    setToken(state, token: Token) {
      state.token = token.data;
    },
    setPersonen(state, personen: Persoon[]) {
      state.personen = personen;
    },
    setProducten(state, producten: Product[]) {
      state.producten = producten;
    },
    invalidateToken(state) {
      state.token = null;
    },
  },
  actions: {
    async listUsers({
      state,
      commit,
    }): Promise<void> {
      const fetch = getFetch(state, commit);
      const response = await fetch<Persoon[]>({
        url: '/api/v3/bar/personen',
        method: 'POST',
      });

      commit('setPersonen', Object.values(response.data)
        .sort((a, b) => b.recent - a.recent));
    },
    async listProducten({
      state,
      commit,
    }): Promise<void> {
      const fetch = getFetch(state, commit);
      const response = await fetch<Product[]>({
        url: '/api/v3/bar/producten',
        method: 'POST',
      });

      commit('setProducten', Object.values(response.data));
    },
  },
  modules: {},
});
