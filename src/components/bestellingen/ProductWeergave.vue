<template>
  <v-row :gutter="20">
    <v-col :span="4" v-for="product in producten" :key="product.productId">
      <v-btn x-large class="btn-product" @click="$emit('selecteer', product)">
        <div>{{ product.beschrijving }}</div>
        <div>{{ formatBedrag(product.prijs) }}</div>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Product } from '@/model';
import { formatBedrag } from '@/util';

export default Vue.extend({
  name: 'ProductWeergave',
  props: {
    producten: {
      type: Array as PropType<Product[]>,
      default: () => [],
    },
  },
  methods: {
    formatBedrag,
  },
});
</script>

<style scoped>
.btn-product {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
