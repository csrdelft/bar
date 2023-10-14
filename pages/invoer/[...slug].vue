<script lang="ts" setup>
import { useTypedRouter } from "~/generated";
import { useMainStore } from "~/stores";
import { useBestellingStore } from "~/stores/bestelling";
import { useInvoerStore } from "~/stores/invoer";
import { usePersoonStore } from "~/stores/persoon";
import { useProductStore } from "~/stores/product";
import { Product } from "~/types/product";
import { sum } from "~/utils/list";
import { SaldoError } from "~/utils/util";

const aantal = ref("");
const bestellingLaden = ref(false);
const forceBestelling = ref(false);
const notificatie = ref("");
const notificatieWeergeven = ref(false);

const { router, routes } = useTypedRouter();

const bestellingStore = useBestellingStore();
const invoerStore = useInvoerStore();
const productStore = useProductStore();
const persoonStore = usePersoonStore();
const mainStore = useMainStore();

const saldo = computed((): number => {
  const saldo = persoonStore.huidigePersoon?.saldo;

  if (!saldo) return 0;

  if (invoerStore.oudeBestelling) {
    return saldo + sum(...invoerStore.oudeBestelling.inhoud.map((b) => b.product.prijs * b.aantal));
  }

  return saldo;
});
const totaal = computed((): number => {
  const inhoud = Object.values(invoerStore.inhoud);
  return sum(...inhoud.map((b) => b.product.prijs * b.aantal));
});

const verwijderInvoer = (id: string) => {
  invoerStore.verwijderInvoer(id);
};
const selecteerInvoer = (product: Product): void => {
  invoerStore.selecteerInvoer({
    product,
    aantal: aantal.value,
  });

  aantal.value = "";
};
const plaatsBestelling = async () => {
  try {
    bestellingLaden.value = true;

    await mainStore.plaatsBestelling({
      force: false,
    });
  } catch (e: any) {
    if (e instanceof SaldoError) {
      try {
        //FIXME:
        // await this.$notify.confirm({ text: e.message }, { yesText: "Doorgaan", noText: "Terug" });

        await mainStore.plaatsBestelling({
          force: true,
        });
      } catch (e) {
        // confirm geannuleerd
      }
    } else {
      //FIXME:
      // this.$notify.show({ text: e.message });
    }
  } finally {
    bestellingLaden.value = false;

    await router.replace({ name: routes.personen });
  }
};

const annuleer = (): void => {
  invoerStore.clearInvoer();
  aantal.value = "";
  persoonStore.setPersoonSelectie(null);
  router.replace({ name: routes.personen });
};

onMounted(async () => {
  const route = useRoute();
  persoonStore.setPersoonSelectie(route.params.slug as string);

  if (route.params.bestellingId) {
    const oudeBestelling = bestellingStore.bestellingen[route.params.bestellingId as string];

    invoerStore.setInvoer(oudeBestelling.inhoud);
    invoerStore.setOudeInvoer(oudeBestelling);
  } else {
    // FIXME: werkt dit?
    invoerStore.setInvoer([]);
  }

  await persoonStore.listUsers();
  await productStore.listProducten();
});

definePageMeta({
  middleware: ["token"],
});
</script>

<template>
  <div>
    <div v-if="persoonStore.huidigePersoon">
      <v-app-bar flat :color="persoonStore.huidigePersoon.saldo > 0 ? 'success' : 'error'">
        <v-toolbar-title>{{ persoonStore.huidigePersoon.weergave }}</v-toolbar-title>
      </v-app-bar>
      <v-row>
        <v-col lg="9">
          <v-row class="bestelling-inhoud">
            <v-col
              lg="3"
              v-for="bestelling in invoerStore.inhoud"
              :key="bestelling.product.id + ' ' + bestelling.aantal"
            >
              <v-card class="product" @click="verwijderInvoer(bestelling.product.id)">
                <v-card-title class="product-title">
                  {{ bestelling.product.beschrijving }}

                  <v-spacer></v-spacer>

                  <v-btn prepend-icon="mdi-close">Close</v-btn>
                </v-card-title>
                <v-card-text class="text-h5">
                  {{ bestelling.aantal }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <BestellingProductWeergave
            :producten="productStore.zichtbareProducten"
            @selecteer="selecteerInvoer"
          />
        </v-col>
        <v-col lg="3">
          <Numpad default-value="1" v-model="aantal" />
          <BestellingSamenvatting
            :bestelling-laden="bestellingLaden"
            :saldo="saldo"
            :totaal="totaal"
            @annuleer="annuleer"
            @plaatsBestelling="plaatsBestelling"
          />
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="notificatieWeergeven" top color="error" timeout="5000">
      {{ notificatie }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="notificatieWeergeven = false">
          Sluiten
        </v-btn>
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
