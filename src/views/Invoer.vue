<template>
  <div>
    <div v-if="persoon">
      <v-app-bar flat :color="persoon.saldo > 0 ? 'success' : 'error'">
        <v-toolbar-title>{{ persoon.naam }}</v-toolbar-title>
      </v-app-bar>
      <v-row>
        <v-col lg="9">
          <v-row class="bestelling-inhoud">
            <v-col
              lg="3"
              v-for="bestelling in bestellingInhoud"
              :key="bestelling.product.productId + ' ' + bestelling.aantal"
            >
              <v-card
                class="product"
                @click="verwijderInvoer(bestelling.product.productId)"
              >
                <v-card-title class="product-title">
                  {{ bestelling.product.beschrijving }}

                  <v-spacer></v-spacer>

                  <v-btn icon>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="text-h5">{{
                  bestelling.aantal
                }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <ProductWeergave
            :producten="producten"
            @selecteer="selecteerInvoer"
          />
        </v-col>
        <v-col lg="3">
          <Numpad default-value="1" v-model="aantal" />
          <BestellingSamenvatting
            :bestelling-laden="bestellingLaden"
            :persoon="persoon"
            :totaal="totaal"
            :annuleer="annuleer"
            :plaatsBestelling="plaatsBestelling"
          />
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="notificatieWeergeven" top color="error" timeout="5000">
      {{notificatie}}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="notificatieWeergeven = false"
        >
          Sluiten
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BestellingInhoud, Persoon, Product } from "../model";
import Numpad from "../components/Numpad.vue";
import { formatBedrag, SaldoError, sum } from "../util";
import ProductWeergave from "../components/bestellingen/ProductWeergave.vue";
import BestellingSamenvatting from "../components/bestellingen/BestellingSamenvatting.vue";

export default Vue.extend({
  name: "Bestelling",
  components: {
    BestellingSamenvatting,
    ProductWeergave,
    Numpad
  },
  props: {
    socCieId: String,
    bestellingId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    aantal: "",
    bestellingLaden: false,
    forceBestelling: false,
    notificatie: '',
    notificatieWeergeven: false,
  }),
  created() {
    this.$store.commit("setSelectie", this.socCieId);

    if (this.bestellingId) {
      const { producten } = this.$store.state;

      this.$store.commit(
        "setInvoer",
        Object.entries(
          this.$store.state.bestelling.bestellingen[this.bestellingId]
            .bestelLijst
        ).map(([id, aantal]) => ({ aantal, product: producten[id] }))
      );
    } else {
      this.$store.commit("setInvoer", {})
    }
  },
  computed: {
    producten(): Product[] {
      return this.$store.getters.zichtbareProducten;
    },
    persoon(): Persoon | null {
      return this.socCieId ? this.$store.state.personen[this.socCieId] : null;
    },
    totaal(): number {
      const inhoud = Object.values(this.bestellingInhoud);
      return sum(...inhoud.map(b => Number(b.product.prijs) * b.aantal));
    },
    bestellingInhoud(): Record<string, BestellingInhoud> {
      return this.$store.state.invoer.inhoud;
    }
  },
  methods: {
    formatBedrag,
    verwijderInvoer(productId: string): void {
      this.$store.commit("verwijderInvoer", productId);
    },
    selecteerInvoer(product: Product): void {
      this.$store.commit("selecteerInvoer", {
        product,
        aantal: this.aantal
      });

      this.aantal = "";
    },
    async plaatsBestelling(): Promise<void> {
      this.bestellingLaden = true;
      try {
        await this.$store.dispatch("plaatsBestelling", {
          inhoud: this.bestellingInhoud,
          persoon: this.persoon,
          force: this.forceBestelling
        });
        this.forceBestelling = false;

        await this.$store.dispatch("postLogin");

        this.bestellingLaden = false;
        this.$store.commit("clearInvoer");
        this.$store.commit("setSelectie", null);
        await this.$router.replace("/personen");
      } catch (e) {
        if (e instanceof SaldoError) {
          setTimeout(() => {
            this.forceBestelling = true;
            this.bestellingLaden = false;
          }, 3000);
        } else {
          this.bestellingLaden = false;
        }

        this.notificatie = e.message;
        this.notificatieWeergeven = true;
      }
    },
    annuleer(): void {
      this.$store.commit("clearInvoer");
      this.aantal = "";
      this.forceBestelling = false;
      this.$store.commit("setSelectie", null);
      this.$router.replace("/personen");
    }
  }
});
</script>

<style scoped>
.btn-product {
  width: 100%;
  padding: 1em 0;
  margin: 10px 0;
}

.bestelling-inhoud {
  height: 200px;
  margin: 20px;
  overflow: hidden;
  overflow-y: auto;
  /* font-size: 30px; */
  align-content: start;
}

.product {
  padding-bottom: 0.3em;
  padding-top: 0.3em;
}

.product-title {
  flex-wrap: nowrap;
  white-space: nowrap;
}
</style>
