<template>
  <div>
    <div v-if="persoon">
      <v-app-bar flat :color="persoon.saldo > 0 ? 'success' : 'error'">
        <v-toolbar-title>{{ persoon.weergave }}</v-toolbar-title>
      </v-app-bar>
      <v-row>
        <v-col lg="9">
          <v-row class="bestelling-inhoud">
            <v-col
                lg="3"
                v-for="bestelling in bestellingInhoud"
                :key="bestelling.product.id + ' ' + bestelling.aantal"
            >
              <v-card
                  class="product"
                  @click="verwijderInvoer(bestelling.product.id)"
              >
                <v-card-title class="product-title">
                  {{ bestelling.product.beschrijving }}

                  <v-spacer></v-spacer>

                  <v-btn icon>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="text-h5">
                  {{ bestelling.aantal }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <ProductWeergave
              :producten="producten"
              @selecteer="selecteerInvoer"
          />
        </v-col>
        <v-col lg="3">
          <Numpad default-value="1" v-model="aantal"/>
          <BestellingSamenvatting
              :bestelling-laden="bestellingLaden"
              :saldo="saldo"
              :totaal="totaal"
              :annuleer="annuleer"
              :plaatsBestelling="plaatsBestelling"
          />
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="notificatieWeergeven" top color="error" timeout="5000">
      {{ notificatie }}
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
import {Bestelling, BestellingInhoud, Persoon, Product} from "@/model";
import Numpad from "../components/Numpad.vue";
import {SaldoError} from "@/util/util";
import ProductWeergave from "../components/bestellingen/ProductWeergave.vue";
import BestellingSamenvatting from "../components/bestellingen/BestellingSamenvatting.vue";
import {sum} from "@/util/list";

export default Vue.extend({
  name: "Bestelling",
  components: {
    BestellingSamenvatting,
    ProductWeergave,
    Numpad
  },
  props: {
    uid: String,
    bestellingId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    aantal: "",
    bestellingLaden: false,
    forceBestelling: false,
    notificatie: "",
    notificatieWeergeven: false
  }),
  created() {
    this.$store.commit("setSelectie", this.uid);

    if (this.bestellingId) {
      const oudeBestelling = this.$store.state.bestelling.bestellingen[this.bestellingId]

      this.$store.commit("setInvoer", oudeBestelling.inhoud);
      this.$store.commit("setOudeInvoer", oudeBestelling);
    } else {
      this.$store.commit("setInvoer", {});
    }
  },
  computed: {
    producten(): Product[] {
      return this.$store.getters.zichtbareProducten;
    },
    saldo(): number {
      const saldo = this.persoon.saldo;
      if (this.oudeBestellingInhoud) {
        return (
            saldo +
            sum(
                ...this.oudeBestellingInhoud.inhoud.map(
                    b => b.product.prijs * b.aantal
                )
            )
        );
      }

      return saldo;
    },
    persoon(): Persoon {
      return this.$store.state.persoon.personen[this.uid];
    },
    totaal(): number {
      const inhoud = Object.values(this.bestellingInhoud);
      return sum(...inhoud.map(b => b.product.prijs * b.aantal));
    },
    bestellingInhoud(): Record<string, BestellingInhoud> {
      return this.$store.state.invoer.inhoud;
    },
    oudeBestellingInhoud(): Bestelling | null {
      return this.$store.state.invoer.oudeBestelling;
    }
  },
  methods: {
    verwijderInvoer(id: number): void {
      this.$store.commit("verwijderInvoer", id);
    },
    selecteerInvoer(product: Product): void {
      this.$store.commit("selecteerInvoer", {
        product,
        aantal: this.aantal
      });

      this.aantal = "";
    },
    async bestel(force: boolean): Promise<void> {
      this.bestellingLaden = true;

      await this.$store.dispatch("plaatsBestelling", {
        inhoud: this.bestellingInhoud,
        persoon: this.persoon,
        force
      });

      this.bestellingLaden = false;

      await this.$router.replace("/personen");
    },
    async plaatsBestelling(): Promise<void> {
      try {
        await this.bestel(false);
      } catch (e) {
        if (e instanceof SaldoError) {
          try {
            await this.$notify.confirm(
                {text: e.message},
                {yesText: "Doorgaan", noText: "Terug"}
            );

            await this.bestel(true);
          } catch (e) {
            // confirm geannuleerd
          }
        } else {
          this.$notify.show({text: e.message});
        }
      } finally {
        this.bestellingLaden = false;
      }
    },
    annuleer(): void {
      this.$store.commit("clearInvoer");
      this.aantal = "";
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
