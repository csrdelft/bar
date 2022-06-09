import { defineStore } from "pinia";
import { Bestelling, BestellingInhoud } from "../types/bestelling";
import { Product } from "../types/product";

interface InvoerState {
  inhoud: Record<string, BestellingInhoud>;
  oudeBestelling: Bestelling | null;
}

export const useInvoerStore = defineStore("invoer", {
  state: (): InvoerState => ({
    inhoud: {} as Record<string, BestellingInhoud>,
    oudeBestelling: null as Bestelling | null,
  }),

  getters: {},

  actions: {
    setInvoer(bestellingen: BestellingInhoud[]) {
      this.inhoud = Object.fromEntries(Object.values(bestellingen).map((b) => [b.product.id, b]));
    },
    setOudeInvoer(bestelling: Bestelling) {
      this.oudeBestelling = bestelling;
    },
    selecteerInvoer({ product, aantal }: { product: Product; aantal: string }) {
      if (!(product.id in this.inhoud)) {
        this.inhoud[product.id] = {
          // product_id: product.id,
          product,
          aantal: 0,
        };
      }

      this.inhoud[product.id] = {
        ...this.inhoud[product.id],
        aantal: this.inhoud[product.id].aantal + (Number(aantal) || 1),
      };

      if (this.inhoud[product.id].aantal === 0) {
        delete this.inhoud[product.id];
      }
    },
    verwijderInvoer(id: string) {
      delete this.inhoud[id];
    },
    clearInvoer() {
      this.inhoud = {};
      this.oudeBestelling = null;
    },
  },
});

