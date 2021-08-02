<template>

  <v-data-table
  :headers="headers"
    :items="personen"
    :row-class-name="tableRowClassName"
    @click:row="rowClick"
    row-key="socCieId"
  >

      <template v-slot:item.saldo="{ item }">
        {{ formatBedrag(item.saldo)}}
      </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Persoon } from '@/model';
import { formatBedrag } from '@/util';

export default Vue.extend({
  name: 'LedenTable',
  props: {
    zoeken: String,
  },
  computed: {
    personen(): Persoon[] {
      return this.$store.getters.personenWeergave
        .filter(this.filterPersoon)
        // Laden van de hele dataset zorgt voor traagheid
        .slice(0, 50);
    },
    headers() {
      return [
        {
          text: "Bijnaam",
          value: "bijnaam",
        },
        {
          text: "Naam",
          value: "naam"
        },
        {
          text: "Saldo",
          value: "saldo",
        }
      ]
    }
  },
  methods: {
    formatBedrag,
    rowClick(row: Persoon) {
      this.$router.push(`/invoer/${row.socCieId}`);
    },
    tableRowClassName({ row }: { row: Persoon }) {
      return row.saldo < 0 ? 'error-row' : 'success-row';
    },
    filterPersoon(persoon: Persoon) {
      return persoon.bijnaam.toUpperCase()
        .match(this.zoeken as string)
        || persoon.naam.toUpperCase()
          .match(this.zoeken as string);
    },
  },
});
</script>

<style scoped>

</style>
