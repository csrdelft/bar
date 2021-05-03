<template>

  <el-table
    :data="personen"
    :row-class-name="tableRowClassName"
    @row-click="rowClick"
    row-key="socCieId"
  >
    <el-table-column prop="bijnaam" label="Bijnaam"/>
    <el-table-column prop="naam" label="Naam"/>
    <el-table-column prop="saldo" label="Saldo">
      <template #default="scope">
        {{ formatBedrag(scope.row.saldo) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Persoon } from '@/model';
import { formatBedrag } from '@/util';

export default defineComponent({
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
  },
  methods: {
    formatBedrag,
    rowClick(row: Persoon) {
      this.$router.push(`/bestelling/${row.socCieId}`);
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
