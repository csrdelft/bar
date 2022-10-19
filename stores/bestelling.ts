import { defineStore } from "pinia";
import { Bestelling } from "~/types/bestelling";
import fetchAuthorized from "~/util/fetch";
import { groupBy } from "~/util/list";

export const useBestellingStore = defineStore("bestelling", () => {
  // MARK: State
  const bestellingen = ref<Record<string, Bestelling>>({});

  // MARK: Getters

  // MARK: Actions/Mutations
  function setBestellingen(bestellingen: Bestelling[]) {
    bestellingen = groupBy(bestellingen, "id");
  }
  function updateBestelling(bestelling: Bestelling) {
    bestellingen[bestelling.id] = bestelling;
  }
  async function fetchBestellingen(data: {
    aantal: string | null;
    begin: string; // FIXME: was Date
    eind: string; // FIXME: was Date
    productType?: string[];
  }) {
    bestellingen.value = groupBy(
      await fetchAuthorized<Bestelling[]>({
        url: "/api/v3/bar/laadLaatste",
        method: "POST",
        body: JSON.stringify(data),
      }),
      "id"
    );
  }
  async function verwijderBestelling(bestelling: Bestelling) {
    const response = await fetchAuthorized<boolean>({
      url: "/api/v3/bar/verwijderBestelling",
      method: "POST",
      body: JSON.stringify({ verwijderBestelling: bestelling.id }),
    });

    if (!response) {
      throw new Error("Verwijderen van bestelling mislukt");
    }

    updateBestelling({
      ...bestelling,
      deleted: true,
    });
  }
  async function herstelBestelling(bestelling: Bestelling) {
    const response = await fetchAuthorized<boolean>({
      url: "/api/v3/bar/undoVerwijderBestelling",
      method: "POST",
      body: JSON.stringify({ undoVerwijderBestelling: bestelling.id }),
    });

    if (!response) {
      throw new Error("Herstellen van bestelling mislukt");
    }

    updateBestelling({
      ...bestelling,
      deleted: false,
    });
  }

  return {
    bestellingen,
    fetchBestellingen,
    herstelBestelling,
    verwijderBestelling,
  };
});

