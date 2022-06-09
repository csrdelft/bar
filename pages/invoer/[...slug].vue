<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { Product } from "../../types/product";
import { Persoon } from "../../types/persoon";
import { Bestelling, BestellingInhoud } from "../../types/bestelling";
import { useTypedRouter } from "../../generated";
import { useMainStore } from "../../stores";
import { useBestellingStore } from "../../stores/bestelling";
import { useInvoerStore } from "../../stores/invoer";
import { usePersoonStore } from "../../stores/persoon";
import { useProductStore } from "../../stores/product";
import { useUserStore } from "../../stores/user";
import { sum } from "../../util/list";
import { SaldoError } from "../../util/util";

interface Props {
  uid: string;
  bestellingId: string;
}

const props = withDefaults(defineProps<Props>(), {
  bestellingId: "",
});

const aantal = ref("");
const bestellingLaden = ref(false);
const forceBestelling = ref(false);
const notificatie = ref("");
const notificatieWeergeven = ref(false);

const { router, routes } = useTypedRouter();

const user = useUserStore();
const bestelling = useBestellingStore();
const invoer = useInvoerStore();
const product = useProductStore();
const persoon = usePersoonStore();
const main = useMainStore();

onBeforeMount(() => {
  user.setSelectie(props.uid);

  if (props.bestellingId) {
    const oudeBestelling = bestelling.bestellingen[props.bestellingId];

    invoer.setInvoer(oudeBestelling.inhoud);
    invoer.setOudeInvoer(oudeBestelling);
  } else {
    // FIXME: werkt dit?
    invoer.setInvoer([]);
  }
});

const producten = (): Product[] => {
  return product.zichtbareProducten;
};
const saldo = (): number => {
  const saldo = huidigePersoon.value.saldo;
  if (oudeBestellingInhoud.value) {
    return saldo + sum(...oudeBestellingInhoud.value.inhoud.map((b) => b.product.prijs * b.aantal));
  }

  return saldo;
};
const huidigePersoon = computed((): Persoon => {
  return persoon.personen[props.uid];
});
const totaal = computed((): number => {
  const inhoud = Object.values(bestellingInhoud);
  return sum(...inhoud.map((b) => b.product.prijs * b.aantal));
});
const bestellingInhoud = computed((): Record<string, BestellingInhoud> => {
  return invoer.inhoud;
});
const oudeBestellingInhoud = computed((): Bestelling | null => {
  return invoer.oudeBestelling;
});

const verwijderInvoer = (id: string) => {
  invoer.verwijderInvoer(id);
};
const selecteerInvoer = (product: Product): void => {
  invoer.selecteerInvoer({
    product,
    aantal: aantal.value,
  });

  aantal.value = "";
};
const bestel = async (force: boolean): Promise<void> => {
  bestellingLaden.value = true;

  await main.plaatsBestelling({
    force,
  });

  bestellingLaden.value = false;

  await router.replace({ name: routes.personen });
};
const plaatsBestelling = async (): Promise<void> => {
  try {
    await bestel(false);
  } catch (e: any) {
    if (e instanceof SaldoError) {
      try {
        //FIXME:
        // await this.$notify.confirm({ text: e.message }, { yesText: "Doorgaan", noText: "Terug" });

        await bestel(true);
      } catch (e) {
        // confirm geannuleerd
      }
    } else {
      //FIXME:
      // this.$notify.show({ text: e.message });
    }
  } finally {
    bestellingLaden.value = false;
  }
};

const annuleer = (): void => {
  invoer.clearInvoer();
  aantal.value = "";
  user.setSelectie(null);
  router.replace({ name: routes.personen });
};
</script>

<template>
  <div>
    <div v-if="huidigePersoon">
      <v-app-bar flat :color="huidigePersoon.saldo > 0 ? 'success' : 'error'">
        <v-toolbar-title>{{ huidigePersoon.weergave }}</v-toolbar-title>
      </v-app-bar>
      <v-row>
        <v-col lg="9">
          <v-row class="bestelling-inhoud">
            <v-col lg="3" v-for="bestelling in bestellingInhoud" :key="bestelling.product.id + ' ' + bestelling.aantal">
              <v-card class="product" @click="verwijderInvoer(bestelling.product.id)">
                <v-card-title class="product-title">
                  {{ bestelling.product.beschrijving }}

                  <v-spacer></v-spacer>

                  <v-btn icon>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="text-h5">
                  {{ bestelling.aantal }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <ProductWeergave :producten="producten" @selecteer="selecteerInvoer" />
        </v-col>
        <v-col lg="3">
          <Numpad default-value="1" v-model="aantal" />
          <BestellingSamenvatting
            :bestelling-laden="bestellingLaden"
            :saldo="saldo"
            :totaal="totaal"
            :annuleer="annuleer"
            :plaatsBestelling="plaatsBestelling"
          />
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="notificatieWeergeven" top color="error" timeout="5000">
      {{ notificatie }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="notificatieWeergeven = false"> Sluiten </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.btn-product {
  width: 100%;
  padding: 1em 0;
  margin: 10px 0;
}

.bestelling-inhoud {
  height: 200px;
  margin: 20px;
  overflow: hidden;
  overflow-y: auto;
  /* font-size: 30px; */
  align-content: start;
}

.product {
  padding-bottom: 0.3em;
  padding-top: 0.3em;
}

.product-title {
  flex-wrap: nowrap;
  white-space: nowrap;
}
</style>

