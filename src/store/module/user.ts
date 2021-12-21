import {BarLocatie, Profiel} from '@/model';
import {fetchAuthorized} from '@/fetch';
import {Data as OAuth2Data} from 'client-oauth2';
import {createToken} from '@/token';
import {defineModule} from "@/util";

export interface UserState {
  profiel: Profiel | null,
  selectie: string | null
  tokenData: OAuth2Data | null
  locatieToken: BarLocatie | null
}

export default defineModule<UserState>({
  state: () => ({
    profiel: null,
    tokenData: null,
    selectie: null,
    locatieToken: null,
  }),
  getters: {
    token: (state) => createToken(state.tokenData),
  },
  mutations: {
    setToken(state, token: OAuth2Data) {
      state.tokenData = token;
    },
    setLocatieToken(state, token: BarLocatie) {
      state.locatieToken = token;
    },
    setProfiel(state, profiel: Profiel) {
      state.profiel = profiel;
    },
    setSelectie(state, persoonId: string) {
      state.selectie = persoonId;
    },
  },
  actions: {
    async fetchProfiel({commit}): Promise<void> {
      const profiel = await fetchAuthorized<Profiel>({
        url: '/api/v3/profiel',
        method: 'GET',
      });

      commit('setProfiel', profiel);
    },
  },
});
