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
    updateBestelling(state, bestelling: Bestelling) {
      state.bestellingen[bestelling.bestelId] = bestelling;
    },
  },
  actions: {
    async fetchBestellingen(
      { state },
      data: {aantal: number, begin: Date, eind: Date, productType?: number[]},
    ): Promise<void> {
      state.bestellingen = await fetchAuthorized<Record<string, Bestelling>>({
        url: '/api/v3/bar/laadLaatste',
        method: 'POST',
        data: JSON.stringify(data),
      });
    },
    async verwijderBestelling({ commit }, bestelling: Bestelling): Promise<void> {
      const response = await fetchAuthorized<boolean>({
        url: '/api/v3/bar/verwijderBestelling',
        method: 'POST',
        data: JSON.stringify({ verwijderBestelling: bestelling }),
      });

      if (!response) {
        throw new Error('Verwijderen van bestelling mislukt');
      }

      commit('updateBestelling', {
        ...bestelling,
        deleted: '1',
      });
    },
    async herstelBestelling({ commit }, bestelling: Bestelling): Promise<void> {
      const response = await fetchAuthorized<boolean>({
        url: '/api/v3/bar/undoVerwijderBestelling',
        method: 'POST',
        data: JSON.stringify({ undoVerwijderBestelling: bestelling }),
      });

      if (!response) {
        throw new Error('Herstellen van bestelling mislukt');
      }

      commit('updateBestelling', {
        ...bestelling,
        deleted: '0',
      });
    },
  },
  getters: {},
});
