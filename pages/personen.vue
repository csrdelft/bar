<script lang="ts" setup>
import Keyboard from "~/components/Keyboard.vue";
import { VDataTable } from "vuetify/lib/labs/components.mjs";
import { Persoon } from "~/types/persoon";
import { useTypedRouter } from "~/generated";

const { bedragFormat } = useFormatter();
const { router, routes } = useTypedRouter();

const query = ref("");

const {
  data: personen,
  error,
  pending,
} = useAsyncData("personen", async () => {
  return await fetchAuthorized<Persoon[]>("/api/v3/bar/personen");
});

const headers = [
  { title: "Bijnaam", key: "naam" },
  { title: "Naam", key: "weergave" },
  { title: "Saldo", key: "saldo" },
];

const rowClick = (row: any) => {
  router.push({ name: routes.invoerSlug, params: { slug: row.uid } });
};

const getColor = (bedrag: number) => {
  if (bedrag > 10) return "success";
  else if (bedrag >= 0) return "warning";
  else return "error";
};

definePageMeta({
  middleware: ["token"],
});
</script>

<template>
  <Keyboard v-model="query" placeholder="Zoeken" :grab-focus="true" />
  <!-- <LedenTable :items="filteredPersonen" :pending="pending" /> -->
  <v-data-table
    :headers="headers"
    :items="personen ?? undefined"
    @click:row="rowClick"
    :items-per-page="50"
    :loading="pending"
    :sortBy="[{ key: 'recent', order: 'desc' }]"
    :search="query"
  >
    <template v-slot:item.saldo="{ item }">
      <v-chip :color="getColor(item.columns.saldo)">
        {{ bedragFormat(item.columns.saldo) }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<style>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-table .error-row td:last-child {
  background: #f2dede;
}

.el-table .success-row td:last-child {
  background: #f0f9eb;
}
</style>

