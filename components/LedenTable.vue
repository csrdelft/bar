<script lang="ts" setup>
import { useTypedRouter } from "~/generated";
import { Persoon } from "~/types/persoon";
import { fetchAuthorized } from "~/composables/fetch";
import { VDataTable } from "vuetify/lib/labs/components.mjs";

interface Props {
  zoeken: string;
}

const props = defineProps<Props>();

const { bedragFormat } = useFormatter();
const { router, routes } = useTypedRouter();

const headers = [
  { title: "Bijnaam", key: "naam" },
  { title: "Naam", key: "weergave" },
  { title: "Saldo", key: "saldo" },
];

const rowClick = (row: any) => {
  router.push({ name: routes.invoerSlug, params: { slug: row.uid } });
};
const filterPersoon = (persoon: Persoon) => {
  return (
    !persoon.deleted &&
    (persoon.weergave.toUpperCase().match(props.zoeken) || persoon.naam.toUpperCase().match(props.zoeken))
  );
};
const getColor = (bedrag: number) => {
  if (bedrag > 10) return "success";
  else if (bedrag >= 0) return "warning";
  else return "error";
};

const {
  data: personen,
  error,
  pending,
} = useAsyncData("personen", async () => {
  return await fetchAuthorized<Persoon[]>("/api/v3/bar/personen");
});
const filteredPersonen = computed(() => {
  return personen.value
    ?.sort((a, b) => a.recent - b.recent)
    .reverse()
    .filter(filterPersoon);
});
</script>

<template>
  <v-data-table :headers="headers" :items="filteredPersonen" @click:row="rowClick" :items-per-page="100">
    <template v-slot:item.saldo="{ item }">
      <v-chip :color="getColor(item.columns.saldo)">
        {{ bedragFormat(item.columns.saldo) }}
      </v-chip>
    </template>
  </v-data-table>
</template>

