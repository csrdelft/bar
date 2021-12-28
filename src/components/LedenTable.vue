<template>
  <v-data-table
      :headers="headers"
      :items="personen"
      @click:row="rowClick"
      item-key="uid"
      :item-class="tableRowClassName"
      :items-per-page="-1"
      hide-default-footer
  >
    <template v-slot:item.saldo="{ item }">
      {{ format(item.saldo) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import {Persoon} from "@/model";
import {format} from "@/util/bedrag";

export default Vue.extend({
  name: "LedenTable",
  props: {
    zoeken: String
  },
  computed: {
    personen(): Persoon[] {
      return this.$store.getters.personenWeergave.filter(this.filterPersoon);
    },
    headers() {
      return [
        {text: "Bijnaam", value: "naam"},
        {text: "Naam", value: "weergave"},
        {text: "Saldo", value: "saldo"}
      ];
    }
  },
  methods: {
    format,
    rowClick(row: Persoon) {
      this.$router.push(`/invoer/${row.uid}`);
    },
    tableRowClassName(row: Persoon) {
      const color = row.saldo < 0 ? "error" : "success";
      const extra = this.$vuetify.theme.dark ? "darken-4" : "lighten-5";

      return `${color} ${extra}`;
    },
    filterPersoon(persoon: Persoon) {
      return (
          persoon.weergave.toUpperCase().match(this.zoeken) ||
          persoon.naam.toUpperCase().match(this.zoeken)
      );
    }
  }
});
</script>

<style scoped>
</style>
