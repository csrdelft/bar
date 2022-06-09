import { defineStore } from "pinia";
import { Bestelling } from "../types/bestelling";
import fetchAuthorized from "../util/fetch";
import { groupBy } from "../util/list";

interface BestellingState {
  bestellingen: Record<string, Bestelling>;
}

export const useBestellingStore = defineStore("bestelling", {
  state: (): BestellingState => ({
    bestellingen: {},
  }),

  getters: {},

  actions: {
    setBestellingen(bestellingen: Bestelling[]) {
      this.bestellingen = groupBy(bestellingen, "id");
    },
    updateBestelling(bestelling: Bestelling) {
      this.bestellingen[bestelling.id] = bestelling;
    },

    async fetchBestellingen(data: {
      aantal: string | null;
      begin: string; // FIXME: was Date
      eind: string; // FIXME: was Date
      productType?: string[];
    }): Promise<void> {
      this.bestellingen = groupBy(
        await fetchAuthorized<Bestelling[]>({
          url: "/api/v3/bar/laadLaatste",
          method: "POST",
          body: JSON.stringify(data),
        }),
        "id"
      );
    },
    async verwijderBestelling(bestelling: Bestelling): Promise<void> {
      const response = await fetchAuthorized<boolean>({
        url: "/api/v3/bar/verwijderBestelling",
        method: "POST",
        body: JSON.stringify({ verwijderBestelling: bestelling.id }),
      });

      if (!response) {
        throw new Error("Verwijderen van bestelling mislukt");
      }

      this.updateBestelling({
        ...bestelling,
        deleted: true,
      });
    },
    async herstelBestelling(bestelling: Bestelling): Promise<void> {
      const response = await fetchAuthorized<boolean>({
        url: "/api/v3/bar/undoVerwijderBestelling",
        method: "POST",
        body: JSON.stringify({ undoVerwijderBestelling: bestelling.id }),
      });

      if (!response) {
        throw new Error("Herstellen van bestelling mislukt");
      }

      this.updateBestelling({
        ...bestelling,
        deleted: false,
      });
    },
  },
});

