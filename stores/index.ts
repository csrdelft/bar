import { defineStore } from "pinia";
import { fetchAuthorized } from "~/composables/fetch";
import { sum } from "~/util/list";
import { isOudlid, SaldoError } from "~/util/util";
import { useInvoerStore } from "./invoer";
import { usePersoonStore } from "./persoon";
import { useUserStore } from "./user";

export const useMainStore = defineStore("main", () => {
  // MARK: State

  // MARK: Getters

  // MARK: Actions/Mutations
  const plaatsBestelling = async ({ force = false }: { force: boolean }) => {
    const userStore = useUserStore();
    const invoerStore = useInvoerStore();
    const persoonStore = usePersoonStore();

    if (!persoonStore.huidigePersoon) {
      throw new Error("Geen persoon geselecteerd");
    }

    const emptyOrder = Object.values(invoerStore.inhoud).length === 0;

    if (emptyOrder) {
      throw new Error("Geen bestelling ingevoerd");
    }

    const oudeInhoud = invoerStore.oudeBestelling;

    const oudLid = isOudlid(persoonStore.huidigePersoon);
    const totaal = sum(...Object.values(invoerStore.inhoud).map((i) => i.aantal * i.product.prijs));

    let nieuwSaldo;
    if (oudeInhoud) {
      const oudTotaal = oudeInhoud.totaal;
      nieuwSaldo = persoonStore.huidigePersoon.saldo + oudTotaal - totaal;
    } else {
      nieuwSaldo = persoonStore.huidigePersoon.saldo - totaal;
    }

    let naarRood = nieuwSaldo < 0;

    // noinspection PointlessBooleanExpressionJS
    if (totaal <= 0 || persoonStore.huidigePersoon.status === "S_NOBODY" || userStore.rechten.beheer) {
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
            uid: persoonStore.huidigePersoon.uid,
            inhoud: Object.fromEntries(Object.values(invoerStore.inhoud).map((i) => [i.product.id, i.aantal])),
            ...(oudeInhoud ? { oudeBestelling: oudeInhoud.id } : {}),
          }),
        });

        persoonStore.setPersoon({
          ...persoonStore.huidigePersoon,
          recent: persoonStore.huidigePersoon.recent + 1,
          saldo: nieuwSaldo,
        });

        // voorkom opnieuw submitten van hetzelfde
        invoerStore.clearInvoer();
      }
    }
  };

  return {
    plaatsBestelling,
  };
});

