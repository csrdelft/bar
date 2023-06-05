import { defineStore } from "pinia";
import { Product } from "~/types/product";

export const useProductStore = defineStore("product", () => {
  // MARK: State
  const producten = ref<Record<string, Product>>({});

  // MARK: Getters
  const zichtbareProducten = computed(() => Object.values(producten.value).filter((p) => !p.beheer && p.status === 1));

  // MARK: Actions/Mutations
  async function listProducten() {
    const data = await fetchAuthorized<Product[]>("/api/v3/bar/producten");

    const productenRecord = Object.fromEntries(data.map((p) => [p.id, p]));

    producten.value = productenRecord;
  }

  return {
    producten,
    zichtbareProducten,
    listProducten,
  };
});

