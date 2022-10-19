import { defineStore } from "pinia";
import { Product } from "~/types/product";

export const useProductStore = defineStore("product", () => {
  // MARK: State
  const producten = ref<Record<string, Product>>({});

  // MARK: Getters
  const zichtbareProducten = computed(() => Object.values(producten.value).filter((p) => !p.beheer && p.status === 1));

  // MARK: Actions/Mutations
  function setProducten(producten: Record<string, Product>) {
    this.producten = producten;
  }

  return {
    producten,
    zichtbareProducten,
    setProducten,
  };
});

