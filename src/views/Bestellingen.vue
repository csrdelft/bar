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
          v-if="scope.row.deleted === '0'"
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Bewerk</el-button>
        <el-button
          v-if="scope.row.deleted === '0'"
          size="mini"
          type="danger"
          :loading="scope.row.bestelId in verwijderLaden"
          @click="handleVerwijder(scope.$index, scope.row)">Verwijder</el-button>
        <el-button
          v-if="scope.row.deleted === '1'"
          size="mini"
          type="warning"
          :loading="scope.row.bestelId in herstelLaden"
          @click="handleHerstel(scope.$index, scope.row)">Herstel</el-button>
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
  data: () => ({
    verwijderLaden: {} as Record<string, boolean>,
    herstelLaden: {} as Record<string, boolean>,
  }),
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
      // TODO: Naar edit ding
      this.$message.error('Not implemented');
      this.$router.push(`/bestelling/${row.persoon}`);
    },
    async handleVerwijder(index: number, row: Bestelling) {
      this.verwijderLaden[row.bestelId] = true;
      try {
        await this.$store.dispatch('verwijderBestelling', row);
      } catch (e) {
        this.$message.error(e.message);
      }
      delete this.verwijderLaden[row.bestelId];
    },
    async handleHerstel(index: number, row: Bestelling) {
      this.herstelLaden[row.bestelId] = true;
      try {
        await this.$store.dispatch('herstelBestelling', row);
      } catch (e) {
        this.$message.error(e.message);
      }
      delete this.verwijderLaden[row.bestelId];
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
