import { defineStore } from "pinia";
import { Bestelling, BestellingInhoud } from "~/types/bestelling";
import { Product } from "~/types/product";

interface InvoerState {
  inhoud: Record<string, BestellingInhoud>;
  oudeBestelling: Bestelling | null;
}

export const useInvoerStore = defineStore("invoer", () => {
  // MARK: State
  const inhoud = ref<Record<string, BestellingInhoud>>({});
  const oudeBestelling = ref<Bestelling | null>(null);

  // MARK: Getters

  // MARK: Actions/Mutations
  function setInvoer(bestellingen: BestellingInhoud[]) {
    inhoud.value = Object.fromEntries(Object.values(bestellingen).map((b) => [b.product.id, b]));
  }
  function setOudeInvoer(bestelling: Bestelling) {
    oudeBestelling.value = bestelling;
  }
  function selecteerInvoer({ product, aantal }: { product: Product; aantal: string }) {
    if (!(product.id in inhoud.value)) {
      inhoud.value[product.id] = {
        // product_id: product.id,
        product,
        aantal: 0,
      };
    }

    inhoud.value[product.id] = {
      ...inhoud.value[product.id],
      aantal: inhoud.value[product.id].aantal + (Number(aantal) || 1),
    };

    if (inhoud.value[product.id].aantal === 0) {
      delete inhoud.value[product.id];
    }
  }
  function verwijderInvoer(id: string) {
    delete inhoud.value[id];
  }
  function clearInvoer() {
    inhoud.value = {};
    oudeBestelling.value = null;
  }

  return {
    inhoud,
    oudeBestelling,
    setInvoer,
    setOudeInvoer,
    selecteerInvoer,
    verwijderInvoer,
    clearInvoer,
  };
});

