import { BarLocatie, Persoon, Profiel } from '@/model';
import { Module } from 'vuex';
import { fetchAuthorized } from '@/fetch';
import { State, UserState } from '@/store/state';
import { Data as OAuth2Data } from 'client-oauth2';
import { createToken } from '@/token';

const defineModule = <T, R>(tree: Module<T, R>): Module<T, R> => tree;

export default defineModule<UserState, State>({
  state: () => ({
    profiel: null,
    tokenData: null,
    selectie: null,
    locatieToken: null,
  }),
  getters: {
    token: (state) => createToken(state.tokenData),
    huidigePersoon: (state, getters, rootState): Persoon | null => {
      if (state.selectie) {
        return rootState.personen[state.selectie];
      }
      return null;
    },
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
    async fetchProfiel({
      commit,
    }): Promise<void> {
      const profiel = await fetchAuthorized<Profiel>({
        url: '/api/v3/profiel',
        method: 'GET',
      });

      commit('setProfiel', profiel);
    },
  },
});
