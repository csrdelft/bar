<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { Bestelling } from "~/types/bestelling";
import { Product } from "~/types/product";
import { Persoon } from "~/types/persoon";
import { useBestellingStore } from "~/stores/bestelling";
import { usePersoonStore } from "~/stores/persoon";
import { useProductStore } from "~/stores/product";
import { useUserStore } from "~/stores/user";
import { useTypedRouter } from "~/generated";

const { router, routes } = useTypedRouter();

const { bedragFormat } = useFormatter();

const user = useUserStore();
const product = useProductStore();
const persoon = usePersoonStore();
const bestelling = useBestellingStore();

const bestellingen = computed((): Bestelling[] => {
  return Object.values(bestelling.bestellingen);
});
const producten = computed((): Product[] => {
  return Object.values<Product>(product.producten).filter((p) => !p.beheer && p.status === 1);
});
const headers = computed(() => {
  return [
    {
      text: "Naam",
      value: "uid",
    },
    { text: "Datum en tijd", value: "moment" },
    { text: "Totaal", value: "totaal" },
    { text: "Bestelling", value: "inhoud" },
    { text: "Opties", value: "opties", sortable: false },
  ];
});
const isIndeterminate = computed((): boolean => {
  return selectedProducten.value.length > 0 && selectedProducten.value.length < producten.value.length;
});
const datumText = computed(() => {
  return datum.value.join(" ~ ");
});

const verwijderLaden = ref({} as Record<string, boolean>);
const herstelLaden = ref({} as Record<string, boolean>);
const productSelectieZichtbaar = ref(false);
const zoekInAlles = ref(true);
const datum = ref([
  new Date(+new Date() - 3600 * 1000 * 24 * 15).toISOString().substr(0, 10),
  new Date().toISOString().substr(0, 10),
] as string[]);
const datumMenu = ref(false);
const selectedProducten = ref([] as string[]);
const checkAll = ref(false);
const shortcuts = ref([
  {
    text: "Afgelopen week",
    value: (() => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
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

const naamFormat = (row: Bestelling): string => {
  return getPersoon(row.uid)?.weergave;
};
const getPersoon = (uid: string): Persoon => {
  return persoon.personen[uid];
};
const getProduct = (id: string): Product => {
  return product.producten[id];
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
const handleEdit = (row: Bestelling) => {
  router.push({ name: routes.invoerSlug, params: { slug: `/${row.uid}/bewerken/${row.id}` } }); // TODO: beter
};
const handleVerwijder = async (row: Bestelling) => {
  verwijderLaden.value[row.id] = true;
  try {
    await bestelling.verwijderBestelling(row);
  } catch (e) {
    //this.$message.error(e.message);
    // TODO: error handling
  }
  delete verwijderLaden.value[row.id];
};
const handleHerstel = async (row: Bestelling) => {
  herstelLaden.value[row.id] = true;
  try {
    await bestelling.herstelBestelling(row);
  } catch (e) {
    //this.$message.error(e.message);
    // TODO: error handling
  }
  delete verwijderLaden.value[row.id];
};
const zoeken = () => {
  bestelling.fetchBestellingen({
    aantal: zoekInAlles.value ? "alles" : user.selectie,
    begin: datum.value[0],
    eind: datum.value[1],
    productType: selectedProducten.value,
  });
};

onBeforeMount(() => {
  setTimeout(() => {
    bestelling.fetchBestellingen({
      aantal: "alles",
      begin: "",
      eind: "",
    });
  }, 1000);
});
</script>

<template>
  <v-row>
    <v-col cols="3">
      <v-switch v-model="zoekInAlles" label="Alleen geselecteerde persoon" />
    </v-col>
    <v-col cols="3">
      <v-menu
        ref="datumMenu"
        v-model="datumMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <!-- TODO: werkend -->
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="datumText"
            label="Datum"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="props"
          ></v-text-field>
        </template>
        <v-date-picker v-model="datum" range min="1950-01-01"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="3">
      <v-dialog v-model="productSelectieZichtbaar">
        <!-- TODO: werkend -->
        <template v-slot:activator="{ props }">
          <v-btn title="Filter op specifieke producten" :type="isIndeterminate ? 'primary' : 'default'" v-bind="props">
            <v-icon>mdi-tune</v-icon>
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
      <v-btn @click="zoeken" size="medium">Zoeken</v-btn>
    </v-col>
    <v-col>
      <v-data-table :items="bestellingen" :headers="headers" sort-by="moment" sort-desc>
        <template v-slot:item.uid="{ item }">
          {{ naamFormat(item) }}
        </template>
        <template v-slot:item.inhoud="{ item }">
          <ul>
            <li v-for="el in item.inhoud" :key="el.id">{{ el.aantal }} {{ el.product.beschrijving }}</li>
          </ul>
        </template>
        <template v-slot:item.totaal="{ item }">
          {{ bedragFormat(item.totaal) }}
        </template>
        <template v-slot:item.moment="{ item }">
          {{ new Date(item.moment).toLocaleString("nl") }}
        </template>
        <template v-slot:item.opties="{ item }">
          <v-icon v-if="!item.deleted" small class="mr-2" @click="handleEdit(item)"> mdi-pencil </v-icon>
          <v-icon v-if="!item.deleted" small @click="handleVerwijder(item)"> mdi-delete </v-icon>
          <v-icon v-if="item.deleted" small @click="handleHerstel(item)">mdi-restore </v-icon>
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

