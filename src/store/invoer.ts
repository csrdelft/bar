import { Bestelling, BestellingInhoud, Persoon, Product } from '@/model';
import { Module } from 'vuex';
import { fetchAuthorized } from '@/fetch';
import { isOudlid, SaldoError, sum } from '@/util';
import { InvoerState, State } from '@/store/state';
import Vue from "vue"

const defineModule = <T, R>(tree: Module<T, R>): Module<T, R> => tree;

export default defineModule<InvoerState, State>({
  state: () => ({
    inhoud: {},
    oudeBestelling: null
  }),
  mutations: {
    setInvoer(state, bestellingen: BestellingInhoud[]) {
      state.inhoud = Object.fromEntries(Object.values(bestellingen)
        .map((b) => [b.product.productId, b]));
    },
    setOudeInvoer(state, bestelling: Bestelling) {
      state.oudeBestelling = bestelling
    },
    selecteerInvoer(state, {
      product,
      aantal,
    }: { product: Product, aantal: string }) {
      if (!(product.productId in state.inhoud)) {
        Vue.set(state.inhoud, product.productId, {
          product,
          aantal: 0,
        })
      }

      Vue.set(state.inhoud, product.productId, {
        ...state.inhoud[product.productId],
        aantal: state.inhoud[product.productId].aantal + (Number(aantal) || 1)
      })

      if (state.inhoud[product.productId].aantal === 0) {
        Vue.delete(state.inhoud, product.productId)
      }
    },
    verwijderInvoer(state, productId: string) {
      Vue.delete(state.inhoud, productId);
    },
    clearInvoer(state) {
      state.inhoud = {};
      state.oudeBestelling = null;
    },
  },
  actions: {
    async plaatsBestelling({ commit, state, rootGetters }, {
      force = false,
    }: {
      force: boolean
    }): Promise<void> {
      const persoon = rootGetters.huidigePersoon;

      if (!persoon) {
        throw new Error("Geen persoon geselecteerd");
      }
      const emptyOrder = Object.values(state.inhoud).length === 0;

      if (emptyOrder) {
        throw new Error("Geen bestelling ingevoerd");
      }

      const oudeInhoud = state.oudeBestelling

      const oudLid = isOudlid(persoon);
      const totaal = sum(...Object.values(state.inhoud)
        .map((i) => i.aantal * i.product.prijs));

      let nieuwSaldo;
      if (oudeInhoud) {
        const oudTotaal = sum(...Object.values(oudeInhoud)
          .map((i) => i.aantal * i.product.prijs));
        nieuwSaldo = persoon.saldo + oudTotaal - totaal
      } else {
        nieuwSaldo = persoon.saldo - totaal
      }

      let naarRood = nieuwSaldo < 0;

      // noinspection PointlessBooleanExpressionJS
      if (totaal <= 0 || persoon.status === 'S_NOBODY' || rootGetters.isBeheer) {
        // Inleg waarschuwt niet.
        naarRood = false;
      }


      if (oudLid && naarRood) {
        throw new Error('Oudleden kunnen niet rood staan, inleg vereist!');
      } else {
        if (!force && naarRood) {
          throw new SaldoError('Laat lid inleggen. Saldo wordt negatief.');
        } else {
          // Set submitting state on true

          const result = {
            persoon,
            bestelTotaal: totaal,
            bestelLijst: Object.fromEntries(Object.values(state.inhoud)
              .map((i) => [i.product.productId, i.aantal])),
            oudeBestelling: oudeInhoud,
          };

          const response = await fetchAuthorized<boolean>({
            url: '/api/v3/bar/bestelling',
            method: 'POST',
            data: {
              bestelling: JSON.stringify(result),
            },
          });

          if (!response) {
            throw new Error(`Er ging iets mis! "${response}"`);
          }

          commit("setPersoon", {
            ...persoon,
            saldo: nieuwSaldo
          })

          // voorkom opnieuw submitten van hetzelfde
          commit("clearInvoer")
        }
      }
    },
  },
  getters: {},
});
