import {Bestelling} from '@/model';
import {fetchAuthorized} from '@/fetch';
import {defineModule, groupBy} from '@/util';

export interface BestellingState {
    bestellingen: Record<string, Bestelling>
}

export default defineModule<BestellingState>({
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
                data: JSON.stringify(data),
            }), 'id');
        },
        async verwijderBestelling({commit}, bestelling: Bestelling): Promise<void> {
            const response = await fetchAuthorized<boolean>({
                url: '/api/v3/bar/verwijderBestelling',
                method: 'POST',
                data: {verwijderBestelling: bestelling.id}
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
                data: {undoVerwijderBestelling: bestelling.id},
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
