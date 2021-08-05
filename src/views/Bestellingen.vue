<template>
  <v-row>
    <v-col cols="3">
      <v-switch v-model="zoekInAlles" label="Alleen geselecteerde persoon" />
    </v-col>
    <v-col cols="3">
      <v-menu
        ref="datumMenu"
        v-model="datumMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="datumText"
            label="Datum"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="datum" range min="1950-01-01"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="3">
      <v-dialog v-model="productSelectieZichtbaar">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            title="Filter op specifieke producten"
            :type="isIndeterminate ? 'primary' : 'default'"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-tune</v-icon>
            Producten
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Selecteer producten</v-card-title>

          <v-card-text>
            <v-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              label="Alle"
              >Alle
            </v-checkbox>
            <v-divider></v-divider>
            <v-row>
              <v-col
                cols="3"
                v-for="product in producten"
                :key="product.id"
              >
                <v-checkbox
                  v-model="selectedProducten"
                  :value="product.id"
                  :label="product.beschrijving"
                >
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col cols="3">
      <v-btn @click="zoeken" size="medium">Zoeken</v-btn>
    </v-col>
    <v-col>
      <v-data-table :items="bestellingen" :headers="headers" sort-by="moment" sort-desc>
        <template v-slot:item.uid="{ item }">
          {{ naamFormatter(item) }}
        </template>
        <template v-slot:item.inhoud="{ item }">
          <ul>
            <li v-for="el in item.inhoud" :key="el.id">
              {{el.aantal}} {{ el.product.beschrijving }}
            </li>
          </ul>
        </template>
        <template v-slot:item.totaal="{ item }">
          {{ formatBedrag(item.totaal) }}
        </template>
        <template v-slot:item.moment="{item}">
          {{ new Date(item.moment).toLocaleString('nl') }}
        </template>
        <template v-slot:item.opties="{ item }">
          <v-icon
            v-if="!item.deleted"
            small
            class="mr-2"
            @click="handleEdit(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="!item.deleted"
            small
            @click="handleVerwijder(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon v-if="item.deleted" small @click="handleHerstel(item)"
            >mdi-restore</v-icon
          >
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { Bestelling, Persoon, Product } from "../model";
import { formatBedrag } from "../util";

export default Vue.extend({
  name: "Bestellingen",
  computed: {
    bestellingen(): Bestelling[] {
      return Object.values(this.$store.state.bestelling.bestellingen);
    },
    producten(): Product[] {
      return Object.values<Product>(this.$store.state.producten).filter(
        p => !p.beheer && p.status === 1
      );
    },
    headers() {
      return [
        {
          text: "Naam",
          value: "uid"
        },
        { text: "Datum en tijd", value: "moment" },
        { text: "Totaal", value: "totaal" },
        { text: "Bestelling", value: "inhoud" },
        { text: "Opties", value: "opties", sortable: false }
      ];
    },
    isIndeterminate(): boolean {
      return (
        this.selectedProducten.length > 0 &&
        this.selectedProducten.length < this.producten.length
      );
    },
    datumText() {
      return this.datum.join(" ~ ");
    }
  },
  data: () => ({
    verwijderLaden: {} as Record<string, boolean>,
    herstelLaden: {} as Record<string, boolean>,
    productSelectieZichtbaar: false,
    zoekInAlles: true,
    datum: [
      new Date(+new Date() - 3600 * 1000 * 24 * 15).toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10)
    ] as string[],
    datumMenu: false,
    selectedProducten: [] as string[],
    // isIndeterminate: false,
    checkAll: false,
    shortcuts: [
      {
        text: "Afgelopen week",
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        })()
      },
      {
        text: "Laatste 2 weken",
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
          return [start, end];
        })()
      },
      {
        text: "Afgelopen maand",
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return [start, end];
        })()
      },
      {
        text: "Laatste 3 maanden",
        value: (() => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          return [start, end];
        })()
      }
    ]
  }),
  methods: {
    naamFormatter(row: Bestelling): string {
      return this.getPersoon(row.uid)?.weergave;
    },
    getPersoon(uid: string): Persoon {
      return this.$store.state.personen[uid];
    },
    getProduct(id: string): Product {
      return this.$store.state.producten[id];
    },
    getBestelLijstString(bestelLijst: Record<string, string>): string[] {
      return Object.entries(bestelLijst).map(
        ([id, aantal]) =>
          `${aantal} ${this.getProduct(id)?.beschrijving}`
      );
    },
    formatBedrag,
    handleCheckedProductenChange(value: string[]) {
      this.checkAll = value.length === this.producten.length;
    },
    handleCheckAllChange(val: boolean) {
      this.selectedProducten = val ? this.producten.map(v => v.id) : [];
    },
    handleEdit(row: Bestelling) {
      this.$router.push(`/invoer/${row.uid}/bewerken/${row.id}`);
    },
    async handleVerwijder(row: Bestelling) {
      this.verwijderLaden[row.id] = true;
      try {
        await this.$store.dispatch("verwijderBestelling", row);
      } catch (e) {
        //this.$message.error(e.message);
        // TODO
      }
      delete this.verwijderLaden[row.id];
    },
    async handleHerstel(row: Bestelling) {
      this.herstelLaden[row.id] = true;
      try {
        await this.$store.dispatch("herstelBestelling", row);
      } catch (e) {
        //this.$message.error(e.message);
        // TODO
      }
      delete this.verwijderLaden[row.id];
    },
    zoeken() {
      this.$store.dispatch("fetchBestellingen", {
        aantal: this.zoekInAlles ? "alles" : this.$store.state.user.selectie,
        begin: this.datum[0],
        eind: this.datum[1],
        productType: this.selectedProducten
      });
    }
  },
  created() {
    setTimeout(() => {
      this.$store.dispatch("fetchBestellingen", {
        aantal: "alles",
        begin: "",
        eind: "",
        productType: []
      });
    }, 1000);
  }
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
