import {Bestelling} from '@/model';
import {fetchAuthorized} from '@/fetch';
import {defineModule, groupBy} from '@/util';

export default defineModule({
  state: () => ({
    bestellingen: {} as Record<string, Bestelling>,
  }),
  mutations: {
    setBestellingen(state, bestellingen: Bestelling[]) {
      state.bestellingen = groupBy(bestellingen, 'id')
    },
    updateBestelling(state, bestelling: Bestelling) {
      state.bestellingen[bestelling.id] = bestelling;
    },
  },
  actions: {
    async fetchBestellingen(
        {state},
        data: { aantal: number, begin: Date, eind: Date, productType?: number[] },
    ): Promise<void> {
      state.bestellingen = groupBy(await fetchAuthorized<Bestelling[]>({
        url: '/api/v3/bar/laadLaatste',
        method: 'POST',
        body: JSON.stringify(data),
      }), 'id');
    },
    async verwijderBestelling({commit}, bestelling: Bestelling): Promise<void> {
      const response = await fetchAuthorized<boolean>({
        url: '/api/v3/bar/verwijderBestelling',
        method: 'POST',
        body: JSON.stringify({verwijderBestelling: bestelling.id})
      });

      if (!response) {
        throw new Error('Verwijderen van bestelling mislukt');
      }

      commit('updateBestelling', {
        ...bestelling,
        deleted: '1',
      });
    },
    async herstelBestelling({commit}, bestelling: Bestelling): Promise<void> {
      const response = await fetchAuthorized<boolean>({
        url: '/api/v3/bar/undoVerwijderBestelling',
        method: 'POST',
        body: JSON.stringify({undoVerwijderBestelling: bestelling.id}),
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
