import Vuex from 'vuex';
import {BarLocatie, Persoon, Product,} from '@/model';
import bestelling, {BestellingState} from '@/store/module/bestelling';
import {fetchAuthorized} from '@/fetch';
import invoer, {InvoerState} from '@/store/module/invoer';
import user, {UserState} from '@/store/module/user';
import persoon, {PersonenState} from './module/persoon';
import Vue from 'vue';
import {isOudlid, SaldoError, sum} from "@/util";
import product, {ProductenState} from "@/store/module/product";
import {saveTokenPlugin} from "@/store/plugin/token";

Vue.use(Vuex)

export interface State {
    bestelling: BestellingState
    invoer: InvoerState
    user: UserState
    persoon: PersonenState
    product: ProductenState
}


export default new Vuex.Store<State>({
    devtools: true,
    plugins: [saveTokenPlugin('setToken', 'setLocatieToken')],
    getters: {
        personenWeergave: (state) => Object.values<Persoon>(state.persoon.personen)
            .filter((p: Persoon) => !p.deleted)
            .sort((a, b) => a.recent - b.recent)
            .reverse(),
        zichtbareProducten: (state) => Object.values(state.product.producten)
            .filter((p) => !p.beheer && p.status === 1),
        isAdmin: (state) => state.user.profiel?.scopes.includes("BAR:TRUST") ?? false,
        isBeheer: (state) => state.user.profiel?.scopes.includes("BAR:BEHEER") ?? false,
        huidigePersoon: (state): Persoon | null =>
            state.user.selectie ? state.persoon.personen[state.user.selectie] : null,
    },
    mutations: {},
    actions: {
        async listProducten({commit}): Promise<void> {
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
        async vertrouwLocatie({commit}, naam: string) {
            const barLocatie = await fetchAuthorized<BarLocatie>({
                url: '/api/v3/bar/trust',
                method: 'POST',
                data: JSON.stringify({naam}),
            });

            commit('setLocatieToken', barLocatie);
        },
        async plaatsBestelling({commit, state, getters}, {
            force = false,
        }: {
            force: boolean
        }): Promise<void> {
            const huidigePersoon: Persoon = getters.huidigePersoon;

            if (!huidigePersoon) {
                throw new Error("Geen persoon geselecteerd");
            }
            const emptyOrder = Object.values(state.invoer.inhoud).length === 0;

            if (emptyOrder) {
                throw new Error("Geen bestelling ingevoerd");
            }

            const oudeInhoud = state.invoer.oudeBestelling

            const oudLid = isOudlid(huidigePersoon);
            const totaal = sum(...Object.values(state.invoer.inhoud)
                .map((i) => i.aantal * i.product.prijs));

            let nieuwSaldo;
            if (oudeInhoud) {
                const oudTotaal = oudeInhoud.totaal
                nieuwSaldo = huidigePersoon.saldo + oudTotaal - totaal
            } else {
                nieuwSaldo = huidigePersoon.saldo - totaal
            }

            let naarRood = nieuwSaldo < 0;

            // noinspection PointlessBooleanExpressionJS
            if (totaal <= 0 || huidigePersoon.status === 'S_NOBODY' || getters.isBeheer) {
                // Inleg waarschuwt niet.
                naarRood = false;
            }

            if (oudLid && naarRood) {
                throw new Error('Oudleden kunnen niet rood staan, inleg vereist!');
            } else {
                if (!force && naarRood) {
                    throw new SaldoError('Laat lid inleggen. Saldo wordt negatief.');
                } else {
                    await fetchAuthorized<boolean>({
                        url: '/api/v3/bar/bestelling',
                        method: 'POST',
                        data: {
                            uid: huidigePersoon.uid,
                            inhoud: Object.fromEntries(Object.values(state.invoer.inhoud)
                                .map((i) => [i.product.id, i.aantal])),
                            ...(oudeInhoud ? {oudeBestelling: oudeInhoud.id} : {})
                        },
                    });

                    commit("setPersoon", {
                        ...huidigePersoon,
                        recent: huidigePersoon.recent + 1,
                        saldo: nieuwSaldo
                    })

                    // voorkom opnieuw submitten van hetzelfde
                    commit("clearInvoer")
                }
            }
        },
    },
    modules: {
        bestelling,
        invoer,
        user,
        persoon,
        product,
    },
});
