<script lang="ts" setup>
import { Product } from "~/types/product";

interface Props {
  producten: Product[];
}

const props = withDefaults(defineProps<Props>(), {
  producten: () => [],
});

const emits = defineEmits<{
  (event: "selecteer", product: Product): void;
}>();

const { bedragFormat } = useFormatter();
</script>

<template>
  <v-row>
    <v-col cols="6" sm="4" lg="2" v-for="product in producten" :key="product.id">
      <v-card class="btn-product" @click="$emit('selecteer', product)">
        <v-card-title>{{ product.beschrijving }}</v-card-title>
        <v-card-subtitle>{{ bedragFormat(product.prijs) }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.btn-product {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

