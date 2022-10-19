<script lang="ts" setup>
import { usePersoonStore } from "~/stores/persoon";
import { useTypedRouter } from "~/generated";

interface Props {
  zoeken: string;
}

const props = defineProps<Props>();

const { bedragFormat } = useFormatter();

const { router, routes } = useTypedRouter();
const persoon = usePersoonStore();

const personen = computed(() => {
  return persoon.personenWeergave.filter(filterPersoon);
});
const headers = computed(() => {
  return [
    { text: "Bijnaam", value: "naam" },
    { text: "Naam", value: "weergave" },
    { text: "Saldo", value: "saldo" },
  ];
});

const rowClick = (row: any) => {
  router.push({ name: routes.invoerSlug, params: { slug: row.uid } }); // TODO: beter
};
const tableRowClassName = (row: any, theme: any) => {
  const isDark = theme.getTheme(theme.current).dark;

  const color = row.saldo < 0 ? "error" : "success";
  const extra = isDark ? "darken-4" : "lighten-5";

  return `${color} ${extra}`;
};
const filterPersoon = (persoon: any) => {
  return persoon.weergave.toUpperCase().match(props.zoeken) || persoon.naam.toUpperCase().match(props.zoeken);
};
</script>

<template>
  <!-- <v-data-table
    :headers="headers"
    :items="personen"
    @click:row="rowClick"
    item-key="uid"
    :item-class="(row: any) => 
      //  tableRowClassName(row, $vuetify.theme)
    "
    :items-per-page="-1"
    hide-default-footer
  >
    <template v-slot:item.saldo="{ item }">
      {{ bedragFormat(item.saldo) }}
    </template>
  </v-data-table> -->
  <div></div>
</template>

