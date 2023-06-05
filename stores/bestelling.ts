import { defineStore } from "pinia";
import { Bestelling } from "~/types/bestelling";
import { fetchAuthorized } from "~/composables/fetch";
import { groupBy } from "~/util/list";

export const useBestellingStore = defineStore("bestelling", () => {
  // MARK: State
  const bestellingen = ref<Record<string, Bestelling>>({});

  // MARK: Getters

  // MARK: Actions/Mutations
  function setBestellingen(bestellingen: Bestelling[]) {
    bestellingen = groupBy(bestellingen, "id");
  }
  function updateBestelling(id: number, data: Partial<Bestelling>) {
    bestellingen.value[id] = {
      ...bestellingen.value[id],
      ...data,
    };
  }
  async function fetchBestellingen(data: { aantal: string | null; begin: Date; eind: Date; productType?: string[] }) {
    bestellingen.value = groupBy(
      await fetchAuthorized<Bestelling[]>("/api/v3/bar/laadLaatste", {
        body: JSON.stringify({
          aantal: data.aantal,
          begin: data.begin.toISOString(),
          eind: data.eind.toISOString(),
          productType: data.productType,
        }),
      }),
      "id"
    );
  }
  async function verwijderBestelling(id: number) {
    const response = await fetchAuthorized<boolean>("/api/v3/bar/verwijderBestelling", {
      body: JSON.stringify({ verwijderBestelling: id }),
    });

    if (!response) {
      throw new Error("Verwijderen van bestelling mislukt");
    }

    updateBestelling(id, { deleted: true });
  }
  async function herstelBestelling(id: number) {
    const response = await fetchAuthorized<boolean>("/api/v3/bar/undoVerwijderBestelling", {
      body: JSON.stringify({ undoVerwijderBestelling: id }),
    });

    if (!response) {
      throw new Error("Herstellen van bestelling mislukt");
    }

    updateBestelling(id, { deleted: false });
  }

  return {
    bestellingen,
    fetchBestellingen,
    herstelBestelling,
    verwijderBestelling,
  };
});

