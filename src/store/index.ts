import Vuex, {Module} from 'vuex';
import {BarLocatie, Persoon, Product,} from '@/model';
import bestelling from '@/store/module/bestelling';
import {fetchAuthorized} from '@/util/fetch';
import invoer from '@/store/module/invoer';
import user from '@/store/module/user';
import persoon from './module/persoon';
import Vue from 'vue';
import {isOudlid, SaldoError} from "@/util/util";
import product from "@/store/module/product";
import {saveTokenPlugin} from "@/store/plugin/token";
import {sum} from "@/util/list";

Vue.use(Vuex)

type StateType<S> = S extends Module<infer T, infer U> ? T : never

export interface State {
  bestelling: StateType<typeof bestelling>
  invoer: StateType<typeof invoer>
  user: StateType<typeof user>
  persoon: StateType<typeof persoon>
  product: StateType<typeof product>
}

export default new Vuex.Store<State>({
  devtools: true,
  plugins: [saveTokenPlugin('setToken', 'setLocatieToken')],
  getters: {
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
        body: JSON.stringify({naam}),
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
      if (totaal <= 0 || huidigePersoon.status === 'S_NOBODY' || getters.rechten.beheer) {
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
            body: JSON.stringify({
              uid: huidigePersoon.uid,
              inhoud: Object.fromEntries(Object.values(state.invoer.inhoud)
                  .map((i) => [i.product.id, i.aantal])),
              ...(oudeInhoud ? {oudeBestelling: oudeInhoud.id} : {})
            }),
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
