import { defineStore } from "pinia";
import { Product } from "~/types/product";

export const useProductStore = defineStore("product", () => {
  // MARK: State
  const producten = ref<Record<string, Product>>({});

  // MARK: Getters
  const zichtbareProducten = computed(() =>
    Object.values(producten.value).filter((p) => !p.beheer && p.status === 1)
  );

  // MARK: Actions/Mutations
  async function listProducten() {
    const data = await $fetch("/api/producten");

    const productIds = data.map((product) => product.id);
    const productEntities = data.reduce((entities: Record<string, Product>, product) => {
      return { ...entities, [product.id]: product };
    }, {});

    producten.value = productEntities;
  }

  return {
    producten,
    zichtbareProducten,
    listProducten,
  };
});
