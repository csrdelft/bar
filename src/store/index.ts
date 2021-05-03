import { createStore, Store } from 'vuex';
import { Persoon, Product, Profiel } from '@/model';
import bestelling from '@/store/bestelling';
import { fetchAuthorized } from '@/fetch';
import { Data as OAuth2Data } from 'client-oauth2';
import {
  createToken, getTokenData, removeToken, setToken,
} from '@/token';
import invoer from '@/store/invoer';
import { State } from '@/store/state';

/**
 * Stop de token uit de cookie in de state en update de cookie als de state veranderd.
 * @param setTokenMutation
 */
const saveTokenPlugin = (setTokenMutation: string) => <S>(store: Store<S>) => {
  const token = getTokenData();

  if (token) {
    store.commit(setTokenMutation, token);
  }

  store.subscribe((mutation) => {
    if (mutation.type === setTokenMutation) {
      if (mutation.payload) {
        setToken(mutation.payload);
      } else {
        removeToken();
      }
    }
  });
};

export default createStore<State>({
  plugins: [saveTokenPlugin('setToken')],
  state: () => ({
    profiel: null as Profiel | null,
    personen: {} as Record<string, Persoon>,
    producten: {} as Record<string, Product>,
    selectie: null as string | null,
    tokenData: null as OAuth2Data | null,
  }),
  getters: {
    zichtbareProducten: (state) => Object.values(state.producten)
      .filter((p) => p.beheer === '0' && p.status === '1'),
    personenWeergave: (state) => Object.values<Persoon>(state.personen)
      .filter((persoon: Persoon) => persoon.deleted === '0')
      .sort((a, b) => b.recent - a.recent),
    token: (state) => createToken(state.tokenData),
    huidigePersoon:
      (state): Persoon|null => (state.selectie ? state.personen[state.selectie] : null),
  },
  mutations: {
    setToken(state, token: OAuth2Data) {
      state.tokenData = token;
    },
    setProfiel(state, profiel: Profiel) {
      state.profiel = profiel;
    },
    setPersonen(state, personen: Record<string, Persoon>) {
      state.personen = personen;
    },
    setProducten(state, producten: Record<string, Product>) {
      state.producten = producten;
    },
    setSelectie(state, persoonId: string) {
      state.selectie = persoonId;
    },
  },
  actions: {
    async listUsers({
      commit,
    }): Promise<void> {
      const response = await fetchAuthorized<Persoon[]>({
        url: '/api/v3/bar/personen',
        method: 'POST',
      });

      const personen = Object.values(response);
      const personenRecord = Object.fromEntries(personen.map((p) => [p.socCieId, p]));

      commit('setPersonen', personenRecord);
    },
    async listProducten({
      commit,
    }): Promise<void> {
      const response = await fetchAuthorized<Product[]>({
        url: '/api/v3/bar/producten',
        method: 'POST',
      });

      const producten = Object.values(response);
      const productenRecord = Object.fromEntries(producten.map((p) => [p.productId, p]));

      commit('setProducten', productenRecord);
    },
    async fetchProfiel({
      commit,
    }): Promise<void> {
      const profiel = await fetchAuthorized<Profiel>({
        url: '/api/v3/profiel',
        method: 'GET',
      });

      commit('setProfiel', profiel);
    },
    async postLogin({
      dispatch,
    }): Promise<void> {
      // Dit allemaal tegelijk geeft timing issues op windows...
      await dispatch('fetchProfiel');
      await dispatch('listUsers');
      await dispatch('listProducten');
    },
  },
  modules: {
    bestelling,
    invoer,
  },
});
