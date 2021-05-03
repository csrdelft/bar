<template>
  <div v-if="persoon">
    <el-row>
      <el-col :span="18">
        <el-row>
          <el-col
            :span="4"
            v-for="bestelling in bestellingInhoud"
            :key="bestelling.product.productId"
          >
            <div class="product">{{bestelling.aantal}} {{ bestelling.product.beschrijving }}</div>
          </el-col>
        </el-row>

        <el-button
          class="btn-product"
          v-for="product in producten" :key="product.productId"
          @click="selecteerProduct(product)"
        >
          <div>{{ product.beschrijving }}</div>
          <div>{{ formatBedrag(product.prijs) }}</div>
        </el-button>
      </el-col>
      <el-col :span="6">
        <Numpad default-value="1" v-model="aantal"/>

        <el-divider/>
        <span>
          Huidig saldo: {{ formatBedrag(persoon.saldo) }}
        </span>
        <el-divider/>
        <span>
          Totaal bestelling: {{ formatBedrag(totaal) }}
        </span>
        <el-divider/>
        <span>
          Nieuw Saldo: {{ formatBedrag(persoon.saldo - totaal) }}
        </span>
        <el-divider/>
        <div>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="plaatsBestelling"
            :loading="bestellingLaden"
          />
          <el-button type="danger" icon="el-icon-close" @click="annuleer"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BestellingInhoud, Persoon, Product } from '@/model';
import Numpad from '@/components/Numpad.vue';
import { formatBedrag, sum } from '@/util';

export default defineComponent({
  name: 'Bestelling',
  components: { Numpad },
  props: {
    socCieId: String,
  },
  data: () => ({
    bestellingInhoud: {} as Record<string, BestellingInhoud>,
    aantal: '',
    bestellingLaden: false,
  }),
  created() {
    this.$store.commit('setSelectie', this.$store.state.personen[this.socCieId]);
  },
  beforeUnmount() {
    this.$store.commit('setSelectie', null);
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
        .map((b) => Number(this.getProduct(b.product.productId).prijs) * b.aantal));
    },
  },
  methods: {
    formatBedrag,
    getProduct(productId: string): Product {
      return this.$store.state.producten[productId];
    },
    selecteerProduct(product: Product): void {
      if (!(product.productId in this.bestellingInhoud)) {
        this.bestellingInhoud[product.productId] = {
          product,
          aantal: 0,
        };
      }

      this.bestellingInhoud[product.productId].aantal += Number(this.aantal) || 1;
      this.aantal = '';

      if (this.bestellingInhoud[product.productId].aantal === 0) {
        delete this.bestellingInhoud[product.productId];
      }
    },
    async plaatsBestelling(): Promise<void> {
      this.bestellingLaden = true;
      try {
        await this.$store.dispatch('plaatsBestelling', {
          inhoud: this.bestellingInhoud,
          persoon: this.persoon,
        });

        this.bestellingLaden = false;
        await this.$store.dispatch('postLogin');
        this.$router.replace('/personen');
      } catch (e) {
        this.$message.error(e.message);
        this.bestellingLaden = false;
      }
    },
    annuleer(): void {
      this.bestellingInhoud = {};
      this.aantal = '';
      this.$router.replace('/personen');
    },
  },
});
</script>

<style scoped>
.btn-product {
  padding: 2em;
  margin: 1em;
}

</style>
