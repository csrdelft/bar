import { defineStore } from "pinia";
import { Product } from "../types/product";

interface ProductState {
  producten: Record<string, Product>;
}

export const useProductStore = defineStore("product", {
  state: (): ProductState => ({
    producten: {},
  }),

  getters: {
    zichtbareProducten: (state: ProductState) =>
      Object.values(state.producten).filter((p) => !p.beheer && p.status === 1),
  },

  actions: {
    setProducten(producten: Record<string, Product>) {
      this.producten = producten;
    },
  },
});

