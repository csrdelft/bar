<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { useTypedRouter } from "~/generated";
import { useBestellingStore } from "~/stores/bestelling";
import { usePersoonStore } from "~/stores/persoon";
import { useProductStore } from "~/stores/product";
import { useUserStore } from "~/stores/user";
import { Bestelling } from "~/types/bestelling";
import { Product } from "~/types/product";

const { router, routes } = useTypedRouter();
const { bedragFormat, datumFormat } = useFormatter();

const productStore = useProductStore();
const persoonStore = usePersoonStore();
const bestellingStore = useBestellingStore();

const startDate = new Date(Date.now() - 3600 * 1000 * 24 * 15);
const endDate = new Date();
const datum = ref([startDate, endDate]);

const bestellingen = computed((): Bestelling[] => {
  return Object.values(bestellingStore.bestellingen);
});
const producten = computed((): Product[] => {
  return Object.values<Product>(productStore.producten).filter((p) => !p.beheer && p.status === 1);
});
const headers = [
  {
    title: "Naam",
    key: "uid",
  },
  { title: "Datum en tijd", key: "moment" },
  { title: "Totaal", key: "totaal" },
  { title: "Bestelling", key: "inhoud" },
  { title: "Opties", key: "opties", sortable: false },
];

const isIndeterminate = computed((): boolean => {
  return selectedProducten.value.length > 0 && selectedProducten.value.length < producten.value.length;
});
// const datumText = computed(() => {
//   return datum.value.join(" ~ ");
// });

const verwijderLaden = ref({} as Record<string, boolean>);
const herstelLaden = ref({} as Record<string, boolean>);
const productSelectieZichtbaar = ref(false);
const zoekInAlles = ref(true);
const selectedProducten = ref([] as string[]);
const checkAll = ref(false);
const shortcuts = ref([
  {
    text: "Afgelopen week",
    value: (() => {
      const end = new Date();
      const start = new Date(Date.now() - 3600 * 1000 * 24 * 7);
      return [start, end];
    })(),
  },
  {
    text: "Laatste 2 weken",
    value: (() => {})(),
  },
  {
    text: "Afgelopen maand",
    value: (() => {})(),
  },
  {
    text: "Laatste 3 maanden",
    value: (() => {})(),
  },
]);

const naamFormat = (uid: string): string => {
  return persoonStore.personen[uid]?.weergave;
};
const getProduct = (id: string): Product => {
  return productStore.producten[id];
};
const getBestelLijstString = (bestelLijst: Record<string, string>): string[] => {
  return Object.entries(bestelLijst).map(([id, aantal]) => `${aantal} ${getProduct(id)?.beschrijving}`);
};
const handleCheckedProductenChange = (value: string[]) => {
  checkAll.value = value.length === producten.value.length;
};
const handleCheckAllChange = (val: boolean) => {
  selectedProducten.value = val ? producten.value.map((v) => v.id) : [];
};
const handleEdit = (id: number, uid: string) => {
  router.push({
    name: routes.invoerSlug,
    params: { slug: `/${uid}/bewerken/${id}` },
  }); // TODO: beter
};
const handleVerwijder = async (id: number) => {
  verwijderLaden.value[id] = true;
  try {
    await bestellingStore.verwijderBestelling(id);
  } catch (e) {
    //this.$message.error(e.message);
    // TODO: error handling
  }
  delete verwijderLaden.value[id];
};
const handleHerstel = async (id: number) => {
  herstelLaden.value[id] = true;
  try {
    await bestellingStore.herstelBestelling(id);
  } catch (e) {
    //this.$message.error(e.message);
    // TODO: error handling
  }
  delete verwijderLaden.value[id];
};
const zoeken = () => {
  bestellingStore.fetchBestellingen({
    aantal: zoekInAlles.value ? "alles" : persoonStore.persoonSelectie,
    begin: datum.value[0],
    eind: datum.value[1],
    productType: selectedProducten.value,
  });
};

onMounted(() => {
  bestellingStore.fetchBestellingen({
    aantal: "alles",
    begin: datum.value[0],
    eind: datum.value[1],
  });

  persoonStore.listUsers();
  productStore.listProducten();
});

definePageMeta({
  middleware: ["token"],
});
</script>

<template>
  <v-row>
    <v-col cols="3">
      <v-switch v-model="zoekInAlles" label="Alleen geselecteerde persoon" />
    </v-col>
    <v-col cols="3">
      <v-input prepend-icon="mdi-calendar">
        <VueDatePicker v-model="datum" range min-date="1960-01-01" :enable-time-picker="false">
          <template #input-icon></template>
        </VueDatePicker>
      </v-input>
    </v-col>
    <v-col cols="3">
      <v-dialog v-model="productSelectieZichtbaar">
        <!-- TODO: werkend -->
        <template v-slot:activator="{ props }">
          <v-btn
            title="Filter op specifieke producten"
            :type="isIndeterminate ? 'primary' : 'default'"
            v-bind="props"
            prepend-icon="mdi-tune"
          >
            Producten
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Selecteer producten</v-card-title>

          <v-card-text>
            <!-- FIXME: -->
            <v-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @update:modelValue="handleCheckAllChange"
              label="Alle"
            >
              Alle
            </v-checkbox>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="3" v-for="product in producten" :key="product.id">
                <v-checkbox v-model="selectedProducten" :value="product.id" :label="product.beschrijving"> </v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col cols="3">
      <v-btn @click="zoeken">Zoeken</v-btn>
    </v-col>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="bestellingen"
        :items-per-page="25"
        :sortBy="[{ key: 'moment', order: 'desc' }]"
      >
        <template v-slot:item.uid="{ item }">
          {{ naamFormat(item.raw.uid) }}
        </template>
        <template v-slot:item.inhoud="{ item }">
          <ul>
            <li v-for="el in item.raw.inhoud" :key="el.product_id">{{ el.aantal }} {{ el.product.beschrijving }}</li>
          </ul>
        </template>
        <template v-slot:item.totaal="{ item }">
          {{ bedragFormat(item.raw.totaal) }}
        </template>
        <template v-slot:item.moment="{ item }">
          {{ datumFormat(new Date(item.raw.moment)) }}
        </template>
        <template v-slot:item.opties="{ item }">
          <v-icon
            v-if="!item.raw.deleted"
            small
            icon="mdi-pencil"
            class="mr-2"
            @click="handleEdit(item.raw.id, item.raw.uid)"
          />
          <v-icon v-if="!item.raw.deleted" small icon="mdi-delete" @click="handleVerwijder(item.raw.id)" />
          <v-icon v-if="item.raw.deleted" small icon="mdi-restore" @click="handleHerstel(item.raw.id)" />
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<style>
.bar-datepicker .el-picker-panel__sidebar + .el-picker-panel__body {
  margin-left: 140px;
}

.bar-datepicker .el-picker-panel__sidebar {
  width: 140px;
}
</style>

