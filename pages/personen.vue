<script lang="ts" setup>
import Keyboard from "~/components/Keyboard.vue";
import { useTypedRouter } from "~/generated";
import type { Persoon } from "~/types/persoon";

const { bedragFormat } = useFormatter();
const { router, routes } = useTypedRouter();

const query = ref("");

const { data: personen, error, pending } = await useFetch("/api/personen");

const headers = [
  { title: "Bijnaam", key: "naam" },
  { title: "Naam", key: "weergave" },
  { title: "Saldo", key: "saldo" },
];

const rowClick = (
  e: Event,
  value: {
    item: Persoon;
  },
) => {
  router.push({ name: routes.invoerSlug, params: { slug: value.item.uid } });
};

const getColor = (bedrag: number) => {
  if (bedrag > 10) return "success";
  else if (bedrag >= 0) return "warning";
  else return "error";
};

definePageMeta({
  layout: "main",
  middleware: ["protected"],
});
</script>

<template>
  <Keyboard v-model="query" placeholder="Zoeken" :grab-focus="true" />
  <v-data-table
    :headers="headers"
    :items="personen ?? []"
    @click:row="rowClick"
    :items-per-page="50"
    :loading="pending"
    :sortBy="[{ key: 'recent', order: 'desc' }]"
    :search="query"
  >
    <template v-slot:item.saldo="{ value }">
      <v-chip :color="getColor(value)">
        {{ bedragFormat(value) }}
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
