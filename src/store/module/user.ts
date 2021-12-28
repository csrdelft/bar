import {BarLocatie, Profiel} from '@/model';
import {fetchAuthorized} from '@/util/fetch';
import {Data as OAuth2Data} from 'client-oauth2';
import {createToken} from '@/util/token';
import {defineModule} from "@/util/util";

export default defineModule({
  state: () => ({
    profiel: null as Profiel | null,
    tokenData: null as OAuth2Data | null,
    selectie: null as string | null,
    locatieToken: null as BarLocatie | null,
  }),
  getters: {
    token: (state) => createToken(state.tokenData),
    rechten: (state) => ({
      admin: state.profiel?.scopes.includes("BAR:TRUST") ?? false,
      beheer: state.profiel?.scopes.includes("BAR:BEHEER") ?? false,
    })
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
