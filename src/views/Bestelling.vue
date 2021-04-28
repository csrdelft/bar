<template>
  <div>
    <el-button type="primary" v-for="product in producten" :key="product.productId">
      {{ product.beschrijving }}

    </el-button>
    {{ uid }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Product } from '@/model';

export default defineComponent({
  name: 'Bestelling',
  data: () => ({
    uid: '',
  }),
  computed: {
    producten(): Product[] {
      return this.$store.state.producten;
    },
  },
  created() {
    this.uid = this.$route.params.uid as string;
    this.$store.dispatch('listProducten');
  },
  beforeRouteUpdate(to, from, next) {
    this.uid = to.params.uid as string;
    next();
  },
});
</script>

<style scoped>

</style>
