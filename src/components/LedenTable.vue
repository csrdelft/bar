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
        {{ saldoStr(scope.row.saldo) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Persoon } from '@/model';

export default defineComponent({
  name: 'LedenTable',
  computed: {
    personen(): Persoon[] {
      return this.$store.state.personen
        .filter((persoon: Persoon) => persoon.deleted === '0')
        .filter(this.filterPersoon);
    },
  },
  methods: {
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
    saldoStr(saldo: number) {
      let achterKomma = String(Math.abs(saldo % 100));
      if (achterKomma === '0') {
        achterKomma = '00';
      } else if (Number(achterKomma) < 10) {
        achterKomma = `0${achterKomma}`;
      }

      if (saldo > -100 && saldo < 0) return `€-0,${achterKomma}`;

      const string = `€${(saldo - (saldo % 100)) / 100},${achterKomma}`;

      return string.replace('€-', '-€');
    },
  },
});
</script>

<style scoped>

</style>
