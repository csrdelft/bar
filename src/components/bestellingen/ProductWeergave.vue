<template>
  <v-row>
    <v-col cols="6" sm="4" lg="2" v-for="product in producten" :key="product.id">
      <v-card class="btn-product" @click="$emit('selecteer', product)">
        <v-card-title>{{ product.beschrijving }}</v-card-title>
        <v-card-subtitle>{{ formatBedrag(product.prijs) }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {Product} from '@/model';
import {formatBedrag} from '@/util';

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
