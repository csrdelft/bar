import { Bestelling } from '@/model';
import { Module } from 'vuex';
import { fetchAuthorized } from '@/token';

const defineModule = <T, R = unknown>(tree: Module<T, R>): Module<T, R> => tree;

export default defineModule({
  state: () => ({
    bestellingen: {} as Record<string, Bestelling>,
  }),
  mutations: {
    setBestellingen(state, bestellingen: Bestelling[]) {
      state.bestellingen = Object.fromEntries(Object.values(bestellingen)
        .map((b) => [b.bestelId, b]));
    },
  },
  actions: {
    async fetchBestellingen({ state }, {
      aantal, begin, eind, productType,
    }: {aantal: number, begin: Date, eind: Date, productType: number[]}) {
      state.bestellingen = await fetchAuthorized<Record<string, Bestelling>>({
        url: '/api/v3/bar/laadLaatste',
        method: 'POST',
        data: JSON.stringify({
          aantal,
          begin,
          eind,
          // productType,
        }),
      });
    },
  },
  getters: {},
});
