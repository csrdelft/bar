import {Bestelling, BestellingInhoud, Product} from '@/model';
import Vue from "vue"
import {defineModule} from "@/util/util";

export interface InvoerState {
  inhoud: Record<string, BestellingInhoud>
  oudeBestelling: Bestelling | null
}

export default defineModule({
  state: () => ({
    inhoud: {} as Record<string, BestellingInhoud>,
    oudeBestelling: null as Bestelling | null
  }),
  mutations: {
    setInvoer(state, bestellingen: BestellingInhoud[]) {
      state.inhoud = Object.fromEntries(Object.values(bestellingen)
          .map((b) => [b.product.id, b]));
    },
    setOudeInvoer(state, bestelling: Bestelling) {
      state.oudeBestelling = bestelling
    },
    selecteerInvoer(state, {
      product,
      aantal,
    }: { product: Product, aantal: string }) {
      if (!(product.id in state.inhoud)) {
        Vue.set(state.inhoud, product.id, {
          product,
          aantal: 0,
        })
      }

      Vue.set(state.inhoud, product.id, {
        ...state.inhoud[product.id],
        aantal: state.inhoud[product.id].aantal + (Number(aantal) || 1)
      })

      if (state.inhoud[product.id].aantal === 0) {
        Vue.delete(state.inhoud, product.id)
      }
    },
    verwijderInvoer(state, id: string) {
      Vue.delete(state.inhoud, id);
    },
    clearInvoer(state) {
      state.inhoud = {};
      state.oudeBestelling = null;
    },
  },
  actions: {},
  getters: {},
});
