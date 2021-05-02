<template>
  <el-table :data="bestellingen" :default-sort="{prop: 'tijd', order: 'descending'}">
    <el-table-column label="Naam" sortable :formatter="naamFormatter">
    </el-table-column>
    <el-table-column prop="tijd" label="Datum en tijd" sortable/>
    <el-table-column label="Totaal" sortable>
      <template #default="scope">
        {{ formatBedrag(scope.row.bestelTotaal)}}
      </template>
    </el-table-column>
    <el-table-column label="Bestelling">
      <template #default="scope">
        <ul>
          <li v-for="item in getBestelLijstString(scope.row.bestelLijst)" :key="item">
            {{item}}
          </li>
        </ul>
      </template>
    </el-table-column>
    <el-table-column
      label="Opties">
      <template #default="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Bewerk</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Verwijder</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Bestelling, Persoon, Product } from '@/model';
import { formatBedrag } from '@/util';

export default defineComponent({
  name: 'Bestellingen',
  computed: {
    bestellingen(): Bestelling[] {
      return Object.values(this.$store.state.bestelling.bestellingen);
    },
  },
  methods: {
    naamFormatter(row: Bestelling): string {
      return this.getPersoon(row.persoon).naam;
    },
    getPersoon(uid: string): Persoon {
      return this.$store.state.personen[uid];
    },
    getProduct(productId: string): Product {
      return this.$store.state.producten[productId];
    },
    getBestelLijstString(bestelLijst: Record<string, string>): string[] {
      return Object.entries(bestelLijst).map(([productId, aantal]) => `${aantal} ${this.getProduct(productId).beschrijving}`);
    },
    formatBedrag,
    handleEdit(index: number, row: Bestelling) {
      // noop
    },
    handleDelete(index: number, row: Bestelling) {
      // noop
    },
  },
  created() {
    this.$store.dispatch('fetchBestellingen', {
      aantal: 'alles',
      begin: '',
      eind: '',
      productType: [],
    });
  },
});
</script>

<style scoped>

</style>
