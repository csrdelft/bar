<template>
  <v-row>
    <v-col :span="8">
      <v-switch
        v-model="zoekInAlles"
        inactive-text="Geselecteerde persoon"
        active-text="Alle personen"
      />
    </v-col>
    <v-col :span="8">
      <v-date-picker
        v-model="datum"
        type="daterange"
        popper-class="bar-datepicker"
        unlink-panels
        range-separator="tot"
        start-placeholder="Start datum"
        end-placeholder="Eind datum"
        :shortcuts="shortcuts"
      />
    </v-col>
    <v-col :span="4">
      <v-btn
        title="Filter op specifieke producten"
        :type="isIndeterminate ? 'primary' : 'default'"
        icon="el-icon-set-up"
        size="medium"
        @click="productSelectieZichtbaar = true; productSelectieAlle = false"
      >
        Producten
      </v-btn>
      <v-dialog title="Selecteer producten" v-model="productSelectieZichtbaar">
        <v-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >Alle
        </v-checkbox>
        <div style="margin: 15px 0;"></div>
        <v-checkbox-group v-model="selectedProducten" @change="handleCheckedProductenChange">
          <v-row>
            <v-col
              :span="4"
              v-for="product in producten"
              :key="product.productId"
            >
              <v-checkbox
                :label="product.productId"
              >
                {{ product.beschrijving }}
              </v-checkbox>
            </v-col>
          </v-row>
        </v-checkbox-group>
      </v-dialog>
    </v-col>
    <v-col :span="4">
      <v-btn @click="zoeken" size="medium">Zoeken</v-btn>
    </v-col>
    <v-col>
      <v-data-table :items="bestellingen" :headers="headers"></v-data-table>
      <!-- <v-table :data="bestellingen" :default-sort="{prop: 'tijd', order: 'descending'}">
        <v-table-column label="Naam" sortable :formatter="naamFormatter">
        </v-table-column>
        <v-table-column prop="tijd" label="Datum en tijd" sortable/>
        <v-table-column label="Totaal" sortable>
          <template #default="scope">
            {{ formatBedrag(scope.row.bestelTotaal) }}
          </template>
        </v-table-column>
        <v-table-column label="Bestelling">
          <template #default="scope">
            <ul>
              <li v-for="item in getBestelLijstString(scope.row.bestelLijst)" :key="item">
                {{ item }}
              </li>
            </ul>
          </template>
        </v-table-column>
        <v-table-column
          label="Opties">
          <template #default="scope">
            <v-btn
              v-if="scope.row.deleted === '0'"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">Bewerk
            </v-btn>
            <v-btn
              v-if="scope.row.deleted === '0'"
              size="mini"
              type="danger"
              :loading="scope.row.bestelId in verwijderLaden"
              @click="handleVerwijder(scope.$index, scope.row)">Verwijder
            </v-btn>
            <v-btn
              v-if="scope.row.deleted === '1'"
              size="mini"
              type="warning"
              :loading="scope.row.bestelId in herstelLaden"
              @click="handleHerstel(scope.$index, scope.row)">Herstel
            </v-btn>
          </template>
        </v-table-column>
      </v-table> -->
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { Bestelling, Persoon, Product } from '../model';
import { formatBedrag } from '../util';

export default Vue.extend({
  name: 'Bestellingen',
  computed: {
    bestellingen(): Bestelling[] {
      return Object.values(this.$store.state.bestelling.bestellingen);
    },
    producten(): Product[] {
      return Object.values<Product>(this.$store.state.producten)
        .filter((p) => p.beheer === '0' && p.status === '1');
    },
    headers() {
      return [
        {
          text: "Naam",
          value: "persoon",
        },
        { text: "Datum en tijd", value: "datum"},
        { text: "Totaal", value: "bestelTotaal"},
        { text: "Bestelling", value: "bestelLijst"},
        { text: "Opties"}
      ]
    }
  },
  data: () => ({
    verwijderLaden: {} as Record<string, boolean>,
    herstelLaden: {} as Record<string, boolean>,
    productSelectieZichtbaar: false,
    zoekInAlles: true,
    datum: [(new Date(+new Date() - 3600 * 1000 * 24 * 15)), new Date()] as Date[],
    selectedProducten: [] as string[],
    isIndeterminate: false,
    checkAll: false,
    shortcuts: [{
      text: 'Afgelopen week',
      value: (() => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      })(),
    }, {
      text: 'Laatste 2 weken',
      value: (() => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
        return [start, end];
      })(),
    }, {
      text: 'Afgelopen maand',
      value: (() => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      })(),
    }, {
      text: 'Laatste 3 maanden',
      value: (() => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      })(),
    }],
  }),
  methods: {
    naamFormatter(row: Bestelling): string {
      return this.getPersoon(row.persoon)?.naam;
    },
    getPersoon(uid: string): Persoon {
      return this.$store.state.personen[uid];
    },
    getProduct(productId: string): Product {
      return this.$store.state.producten[productId];
    },
    getBestelLijstString(bestelLijst: Record<string, string>): string[] {
      return Object.entries(bestelLijst)
        .map(([productId, aantal]) => `${aantal} ${this.getProduct(productId)?.beschrijving}`);
    },
    formatBedrag,
    handleCheckedProductenChange(value: string[]) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.producten.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.producten.length;
    },
    handleCheckAllChange(val: boolean) {
      this.selectedProducten = val ? this.producten.map((v) => v.productId) : [];
      this.isIndeterminate = false;
    },
    handleEdit(index: number, row: Bestelling) {
      this.$router.push(`/invoer/${row.persoon}/bewerken/${row.bestelId}`);
    },
    async handleVerwijder(index: number, row: Bestelling) {
      this.verwijderLaden[row.bestelId] = true;
      try {
        await this.$store.dispatch('verwijderBestelling', row);
      } catch (e) {
        //this.$message.error(e.message);
        // TODO
      }
      delete this.verwijderLaden[row.bestelId];
    },
    async handleHerstel(index: number, row: Bestelling) {
      this.herstelLaden[row.bestelId] = true;
      try {
        await this.$store.dispatch('herstelBestelling', row);
      } catch (e) {
        //this.$message.error(e.message);
        // TODO
      }
      delete this.verwijderLaden[row.bestelId];
    },
    zoeken() {
      this.$store.dispatch('fetchBestellingen', {
        aantal: this.zoekInAlles ? 'alles' : this.$store.state.user.selectie,
        begin: this.datum[0]?.toISOString(),
        eind: this.datum[1]?.toISOString(),
        productType: this.selectedProducten,
      });
    },
  },
  created() {
    setTimeout(() => {
      this.$store.dispatch('fetchBestellingen', {
        aantal: 'alles',
        begin: '',
        eind: '',
        productType: [],
      });
    }, 1000);
  },
});
</script>

<style>
.bar-datepicker .el-picker-panel__sidebar + .el-picker-panel__body {
  margin-left: 140px;
}

.bar-datepicker .el-picker-panel__sidebar {
  width: 140px;
}
</style>