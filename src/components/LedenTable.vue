<template>

  <el-table
    :data="personen"
    :row-class-name="tableRowClassName"
    @row-click="rowClick"
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
  computed: {
    personen(): Persoon[] {
      return Object.values<Persoon>(this.$store.state.personen)
        .filter((persoon: Persoon) => persoon.deleted === '0')
        .filter(this.filterPersoon)
        .sort((a, b) => b.recent - a.recent);
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
      const { zoeken } = this.$store.state;
      return persoon.bijnaam.toUpperCase()
        .match(zoeken)
        || persoon.naam.toUpperCase()
          .match(zoeken);
    },
  },
});
</script>

<style scoped>

</style>
