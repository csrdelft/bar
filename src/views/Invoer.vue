<template>
  <div v-if="persoon">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-row class="bestelling-inhoud">
          <el-col
            :span="6"
            v-for="bestelling in bestellingInhoud"
            :key="bestelling.product.productId"
          >
            <div class="product" @click="verwijderInvoer(bestelling.product.productId)">
              {{ bestelling.aantal }}
              {{ bestelling.product.beschrijving }}
              <span class="el-icon-close"/>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="4"
                  v-for="product in producten" :key="product.productId"
          >
            <el-button
              class="btn-product"
              @click="selecteerInvoer(product)"
            >
              <div>{{ product.beschrijving }}</div>
              <div>{{ formatBedrag(product.prijs) }}</div>
            </el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <Numpad default-value="1" v-model="aantal"/>

        <el-descriptions :column="1" border>
          <el-descriptions-item label="Huidig saldo">
            {{ formatBedrag(persoon.saldo) }}
          </el-descriptions-item>
          <el-descriptions-item label="Totaal bestelling">
            {{ formatBedrag(totaal) }}
          </el-descriptions-item>
          <el-descriptions-item label="Nieuw saldo">
            {{ formatBedrag(persoon.saldo - totaal) }}
          </el-descriptions-item>
        </el-descriptions>
        <el-divider/>
        <div>
          <span>
          Huidig saldo:
          </span>
          <span :style="{float: 'right'}">
            {{ formatBedrag(persoon.saldo) }}
          </span>
        </div>
        <el-divider/>
        <span>
          Totaal bestelling:
          <span :style="{float: 'right'}">{{ formatBedrag(totaal) }}</span>
        </span>
        <el-divider/>
        <span>
          Nieuw Saldo:
          <span :style="{float: 'right'}">{{ formatBedrag(persoon.saldo - totaal) }}</span>
        </span>
        <el-divider/>
        <div>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="plaatsBestelling"
            :loading="bestellingLaden"
          />
          <el-button
            type="danger"
            icon="el-icon-close"
            @click="annuleer"
            :disabled="bestellingLaden"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BestellingInhoud, Persoon, Product } from '@/model';
import Numpad from '@/components/Numpad.vue';
import { formatBedrag, SaldoError, sum } from '@/util';

export default defineComponent({
  name: 'Bestelling',
  components: { Numpad },
  props: {
    socCieId: String,
  },
  data: () => ({
    aantal: '',
    bestellingLaden: false,
    forceBestelling: false,
  }),
  created() {
    this.$store.commit('setSelectie', this.socCieId);
  },
  computed: {
    producten(): Product[] {
      return this.$store.getters.zichtbareProducten;
    },
    persoon(): Persoon {
      return this.$store.state.personen[this.socCieId];
    },
    totaal(): number {
      const inhoud = Object.values(this.bestellingInhoud);
      return sum(...inhoud
        .map((b) => Number(b.product.prijs) * b.aantal));
    },
    bestellingInhoud(): Record<string, BestellingInhoud> {
      return this.$store.state.invoer.inhoud;
    },
  },
  methods: {
    formatBedrag,
    verwijderInvoer(productId: string): void {
      this.$store.commit('verwijderInvoer', productId);
    },
    selecteerInvoer(product: Product): void {
      this.$store.commit('selecteerInvoer', {
        product,
        aantal: this.aantal,
      });

      this.aantal = '';
    },
    async plaatsBestelling(): Promise<void> {
      this.bestellingLaden = true;
      try {
        await this.$store.dispatch('plaatsBestelling', {
          inhoud: this.bestellingInhoud,
          persoon: this.persoon,
          force: this.forceBestelling,
        });
        this.forceBestelling = false;

        await this.$store.dispatch('postLogin');

        this.bestellingLaden = false;
        this.$store.commit('clearInvoer');
        this.$store.commit('setSelectie', null);
        await this.$router.replace('/personen');
      } catch (e) {
        if (e instanceof SaldoError) {
          setTimeout(() => {
            this.forceBestelling = true;
            this.bestellingLaden = false;
          }, 3000);
        } else {
          this.bestellingLaden = false;
        }

        this.$message.error(e.message);
      }
    },
    annuleer(): void {
      this.$store.commit('clearInvoer');
      this.aantal = '';
      this.forceBestelling = false;
      this.$store.commit('setSelectie', null);
      this.$router.replace('/personen');
    },
  },
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
  font-size: 30px;
  align-content: start;
}

.product {
  padding-bottom: .3em;
  padding-top: .3em;
}

</style>