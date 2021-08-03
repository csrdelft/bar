<template>
  <v-data-table
    :headers="headers"
    :items="personen"
    @click:row="rowClick"
    item-key="socCieId"
    :item-class="tableRowClassName"
  >
    <template v-slot:item.saldo="{ item }">
      {{ formatBedrag(item.saldo) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { Persoon } from "@/model";
import { formatBedrag } from "@/util";

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
        {
          text: "Bijnaam",
          value: "bijnaam"
        },
        {
          text: "Naam",
          value: "naam"
        },
        {
          text: "Saldo",
          value: "saldo"
        }
      ];
    }
  },
  methods: {
    formatBedrag,
    rowClick(row: Persoon) {
      this.$router.push(`/invoer/${row.socCieId}`);
    },
    tableRowClassName(row: Persoon) {
      const color = row.saldo < 0 ? "error" : "success";
      const extra = this.$vuetify.theme.dark ? "darken-4" : "ligthen-5";

      return `${color} ${extra}`
    },
    filterPersoon(persoon: Persoon) {
      return (
        persoon.bijnaam.toUpperCase().match(this.zoeken) ||
        persoon.naam.toUpperCase().match(this.zoeken)
      );
    }
  }
});
</script>

<style scoped>
</style>
