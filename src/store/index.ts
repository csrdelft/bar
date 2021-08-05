import Vuex, { Store } from 'vuex';
import {
  BarLocatie, Persoon, Product, Profiel,
} from '@/model';
import bestelling from '@/store/bestelling';
import { fetchAuthorized } from '@/fetch';
import {
  getLocatieToken,
  getTokenData,
  removeLocatieToken,
  removeToken,
  setLocatieToken,
  setToken,
} from '@/token';
import invoer from '@/store/invoer';
import { State } from '@/store/state';
import user from '@/store/user';
import Vue from 'vue';

Vue.use(Vuex)

/**
 * Stop de token uit de cookie in de state en update de cookie als de state veranderd.
 * @param setTokenMutation
 * @param setLocatieTokenMutation
 */
// eslint-disable-next-line max-len
const saveTokenPlugin = (setTokenMutation: string, setLocatieTokenMutation: string) => <S>(store: Store<S>) => {
  const token = getTokenData();
  if (token) {
    store.commit(setTokenMutation, token);
  }

  const locatieToken = getLocatieToken();
  if (locatieToken) {
    store.commit(setLocatieTokenMutation, locatieToken);
  }

  store.subscribe((mutation) => {
    if (mutation.type === setTokenMutation) {
      if (mutation.payload) {
        setToken(mutation.payload);
      } else {
        removeToken();
      }
    }
    if (mutation.type === setLocatieTokenMutation) {
      if (mutation.payload) {
        setLocatieToken(mutation.payload);
      } else {
        removeLocatieToken();
      }
    }
  });
};

export default new Vuex.Store<State>({
  devtools: true,
  plugins: [saveTokenPlugin('setToken', 'setLocatieToken')],
  state: () => ({
    profiel: null as Profiel | null,
    personen: {} as Record<string, Persoon>,
    producten: {} as Record<string, Product>,
  } as unknown as State),
  getters: {
    zichtbareProducten: (state) => Object.values(state.producten)
      .filter((p) => !p.beheer && p.status === 1),
    personenWeergave: (state) => Object.values<Persoon>(state.personen)
      .filter((persoon: Persoon) => persoon.deleted === false)
      .sort((a, b) => b.recent - a.recent),
      isAdmin: (state) => state.user.profiel?.scopes.includes("BAR:TRUST") ?? false,
      isBeheer: (state) => state.user.profiel?.scopes.includes("BAR:BEHEER") ?? false,
  },
  mutations: {
    setPersonen(state, personen: Record<string, Persoon>) {
      state.personen = personen;
    },
    setProducten(state, producten: Record<string, Product>) {
      state.producten = producten;
    },
    setPersoon(state, persoon: Persoon) {
      Vue.set(state.personen, persoon.uid, persoon)
    }
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
      const personenRecord = Object.fromEntries(personen.map((p) => [p.uid, p]));

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
      const productenRecord = Object.fromEntries(producten.map((p) => [p.id, p]));

      commit('setProducten', productenRecord);
    },
    async postLogin({
      dispatch,
    }): Promise<void> {
      // Dit allemaal tegelijk geeft timing issues op windows...
      await dispatch('fetchProfiel');
      await dispatch('listUsers');
      await dispatch('listProducten');
    },
    async vertrouwLocatie({ commit }, naam: string) {
      const barLocatie = await fetchAuthorized<BarLocatie>({
        url: '/api/v3/bar/trust',
        method: 'POST',
        data: JSON.stringify({ naam }),
      });

      commit('setLocatieToken', barLocatie);
    },
    async updateBijnaam({commit, state}, {
      id, 
      name,
    } : {id: string, name: string}): Promise<void> {
      await fetchAuthorized<void>({
        url: '/api/v3/bar/updatePerson',
        method: 'POST',
        data: {
          id,
          name,
        }
      })

      commit('setPersoon', {
        ...state.personen[id],
        bijnaam: name,
      })
    }
  },
  modules: {
    bestelling,
    invoer,
    user,
  },
});
