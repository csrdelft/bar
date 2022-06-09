import { defineStore } from "pinia";
import { BarLocatie } from "../types/barlocatie";
import { Persoon } from "../types/persoon";
import { Product } from "../types/product";
import fetchAuthorized from "../util/fetch";
import { sum } from "../util/list";
import { isOudlid, SaldoError } from "../util/util";

import { useUserStore } from "./user";
import { usePersoonStore } from "./persoon";
import { useProductStore } from "./product";
import { useInvoerStore } from "./invoer";

export const useMainStore = defineStore("main", {
  getters: {
    huidigePersoon: (): Persoon | null => {
      const user = useUserStore();
      const persoon = usePersoonStore();

      return user.selectie ? persoon.personen[user.selectie] : null;
    },
  },
  actions: {
    async listProducten(): Promise<void> {
      const product = useProductStore();

      const response = await fetchAuthorized<Product[]>({
        url: "/api/v3/bar/producten",
        method: "POST",
      });

      const producten = Object.values(response);
      const productenRecord = Object.fromEntries(producten.map((p) => [p.id, p]));

      product.setProducten(productenRecord);
    },
    async postLogin(): Promise<void> {
      const user = useUserStore();
      const persoon = usePersoonStore();

      // Dit allemaal tegelijk geeft timing issues op windows...
      user.fetchProfiel();
      persoon.listUsers();
      this.listProducten();
    },
    async vertrouwLocatie(naam: string) {
      const user = useUserStore();

      const barLocatie = await fetchAuthorized<BarLocatie>({
        url: "/api/v3/bar/trust",
        method: "POST",
        body: JSON.stringify({ naam }),
      });

      user.setLocatieToken(barLocatie);
    },
    async plaatsBestelling({ force = false }: { force: boolean }): Promise<void> {
      const invoer = useInvoerStore();
      const user = useUserStore();
      const persoon = usePersoonStore();

      const huidigePersoon: Persoon | null = this.huidigePersoon;

      if (!huidigePersoon) {
        throw new Error("Geen persoon geselecteerd");
      }

      const emptyOrder = Object.values(invoer.inhoud).length === 0;

      if (emptyOrder) {
        throw new Error("Geen bestelling ingevoerd");
      }

      const oudeInhoud = invoer.oudeBestelling;

      const oudLid = isOudlid(huidigePersoon);
      const totaal = sum(...Object.values(invoer.inhoud).map((i) => i.aantal * i.product.prijs));

      let nieuwSaldo;
      if (oudeInhoud) {
        const oudTotaal = oudeInhoud.totaal;
        nieuwSaldo = huidigePersoon.saldo + oudTotaal - totaal;
      } else {
        nieuwSaldo = huidigePersoon.saldo - totaal;
      }

      let naarRood = nieuwSaldo < 0;

      // noinspection PointlessBooleanExpressionJS
      if (totaal <= 0 || huidigePersoon.status === "S_NOBODY" || user.rechten.beheer) {
        // Inleg waarschuwt niet.
        naarRood = false;
      }

      if (oudLid && naarRood) {
        throw new Error("Oudleden kunnen niet rood staan, inleg vereist!");
      } else {
        if (!force && naarRood) {
          throw new SaldoError("Laat lid inleggen. Saldo wordt negatief.");
        } else {
          await fetchAuthorized<boolean>({
            url: "/api/v3/bar/bestelling",
            method: "POST",
            body: JSON.stringify({
              uid: huidigePersoon.uid,
              inhoud: Object.fromEntries(Object.values(invoer.inhoud).map((i) => [i.product.id, i.aantal])),
              ...(oudeInhoud ? { oudeBestelling: oudeInhoud.id } : {}),
            }),
          });

          persoon.setPersoon({
            ...huidigePersoon,
            recent: huidigePersoon.recent + 1,
            saldo: nieuwSaldo,
          });

          // voorkom opnieuw submitten van hetzelfde
          invoer.clearInvoer();
        }
      }
    },
  },
});

