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
      <v-btn class="product" @click="$emit('selecteer', product)" size="x-large" block :density="null">
        <span class="title">{{ product.beschrijving }}</span>
        <span class="subtitle">{{ bedragFormat(product.prijs) }}</span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<style>
.v-btn.product {
  text-overflow: ellipsis;
  text-transform: capitalize;
  overflow: hidden;
  white-space: nowrap;

  padding: 1.5rem;
}
.v-btn.product .v-btn__content {
  flex-direction: column;
  gap: 0.5rem;
}
.v-btn.product .v-btn__content > .subtitle {
  font-size: small;
}
</style>

