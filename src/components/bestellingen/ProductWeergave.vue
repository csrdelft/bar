<template>
  <el-row :gutter="20">
    <el-col :span="4" v-for="product in producten" :key="product.productId">
      <el-button class="btn-product" @click="$emit('selecteer', product)">
        <div>{{ product.beschrijving }}</div>
        <div>{{ formatBedrag(product.prijs) }}</div>
      </el-button>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Product } from '@/model';
import { formatBedrag } from '@/util';

export default defineComponent({
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
