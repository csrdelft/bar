import { BestellingInhoud, Persoon, Product } from '@/model';
import { Module } from 'vuex';
import { fetchAuthorized } from '@/fetch';
import { isOudlid, SaldoError, sum } from '@/util';
import { InvoerState, State } from '@/store/state';
import Vue from "vue"

const defineModule = <T, R>(tree: Module<T, R>): Module<T, R> => tree;

export default defineModule<InvoerState, State>({
  state: () => ({
    inhoud: {} as Record<string, BestellingInhoud>,
  }),
  mutations: {
    setInvoer(state, bestellingen: BestellingInhoud[]) {
      state.inhoud = Object.fromEntries(Object.values(bestellingen)
        .map((b) => [b.product.productId, b]));
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
    },
  },
  actions: {
    async plaatsBestelling({ state, rootGetters }, {
      oudeInhoud,
      force = false,
    }: {
      persoon: Persoon
      oudeInhoud: Record<string, BestellingInhoud>
      force: boolean
    }): Promise<void> {
      const warningGiven = force;

      const persoon = rootGetters.huidigePersoon;

      const oudLid = isOudlid(persoon);
      const totaal = sum(...Object.values(state.inhoud)
        .map((i) => i.aantal * Number(i.product.prijs)));

      let toRed;
      if (oudeInhoud) {
        const oudTotaal = sum(...Object.values(oudeInhoud)
          .map((i) => i.aantal * Number(i.product.prijs)));
        toRed = persoon.saldo + oudTotaal - totaal < 0;
      } else {
        toRed = persoon.saldo - totaal < 0;
      }

      // noinspection PointlessBooleanExpressionJS
      if (totaal <= 0 || persoon.status === 'S_NOBODY' || /* TODO: beheer */ false) {
        toRed = false;
      }

      const emptyOrder = Object.values(state.inhoud).length === 0;

      if (oudLid && toRed) {
        throw new Error('Oudleden kunnen niet rood staan, inleg vereist!');
      } else if (persoon && !emptyOrder) {
        if (!warningGiven && toRed) {
          // TODO: Timeout!
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
        }
      } else if (emptyOrder) {
        throw new Error('Geen bestelling ingevoerd!');
      }
    },
  },
  getters: {},
});
