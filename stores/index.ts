import { defineStore } from "pinia";
import { fetchAuthorized } from "~/composables/fetch";
import { Persoon } from "~/types/persoon";
import { Product } from "~/types/product";
import { sum } from "~/util/list";
import { isOudlid, SaldoError } from "~/util/util";

import { LocatieToken } from "~/types/token";
import { useInvoerStore } from "./invoer";
import { usePersoonStore } from "./persoon";
import { useProductStore } from "./product";
import { useUserStore } from "./user";

export const useMainStore = defineStore("main", () => {
  // MARK: State

  // MARK: Getters
  const huidigePersoon = computed<Persoon | null>(() => {
    const user = useUserStore();
    const persoon = usePersoonStore();

    return user.selectie ? persoon.personen[user.selectie] : null;
  });

  // MARK: Actions/Mutations
  async function listProducten() {
    const product = useProductStore();

    const response = await fetchAuthorized<Product[]>("/api/v3/bar/producten");

    const producten = Object.values(response);
    const productenRecord = Object.fromEntries(producten.map((p) => [p.id, p]));

    product.setProducten(productenRecord);
  }
  async function postLogin() {
    const user = useUserStore();
    const persoon = usePersoonStore();

    // Dit allemaal tegelijk geeft timing issues op windows...
    user.fetchProfiel();
    persoon.listUsers();
    listProducten();
  }
  async function vertrouwLocatie(naam: string) {
    const user = useUserStore();

    const barLocatie = await fetchAuthorized<LocatieToken>("/api/v3/bar/trust", {
      body: JSON.stringify({ naam }),
    });

    user.setLocatieToken(barLocatie);
  }
  async function plaatsBestelling({ force = false }: { force: boolean }) {
    const invoer = useInvoerStore();
    const user = useUserStore();
    const persoon = usePersoonStore();

    if (!huidigePersoon.value) {
      throw new Error("Geen persoon geselecteerd");
    }

    const emptyOrder = Object.values(invoer.inhoud).length === 0;

    if (emptyOrder) {
      throw new Error("Geen bestelling ingevoerd");
    }

    const oudeInhoud = invoer.oudeBestelling;

    const oudLid = isOudlid(huidigePersoon.value);
    const totaal = sum(...Object.values(invoer.inhoud).map((i) => i.aantal * i.product.prijs));

    let nieuwSaldo;
    if (oudeInhoud) {
      const oudTotaal = oudeInhoud.totaal;
      nieuwSaldo = huidigePersoon.value.saldo + oudTotaal - totaal;
    } else {
      nieuwSaldo = huidigePersoon.value.saldo - totaal;
    }

    let naarRood = nieuwSaldo < 0;

    // noinspection PointlessBooleanExpressionJS
    if (totaal <= 0 || huidigePersoon.value.status === "S_NOBODY" || user.rechten.beheer) {
      // Inleg waarschuwt niet.
      naarRood = false;
    }

    if (oudLid && naarRood) {
      throw new Error("Oudleden kunnen niet rood staan, inleg vereist!");
    } else {
      if (!force && naarRood) {
        throw new SaldoError("Laat lid inleggen. Saldo wordt negatief.");
      } else {
        await fetchAuthorized<boolean>("/api/v3/bar/bestelling", {
          body: JSON.stringify({
            uid: huidigePersoon.value.uid,
            inhoud: Object.fromEntries(Object.values(invoer.inhoud).map((i) => [i.product.id, i.aantal])),
            ...(oudeInhoud ? { oudeBestelling: oudeInhoud.id } : {}),
          }),
        });

        persoon.setPersoon({
          ...huidigePersoon.value,
          recent: huidigePersoon.value.recent + 1,
          saldo: nieuwSaldo,
        });

        // voorkom opnieuw submitten van hetzelfde
        invoer.clearInvoer();
      }
    }
  }

  return {
    huidigePersoon,
    listProducten,
    plaatsBestelling,
  };
});

