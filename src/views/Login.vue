<template>
  <h1><router-link to="/auth/csr">Login</router-link></h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getToken } from '@/token';

export default defineComponent({
  name: 'Login',
  created(): void {
    if (getToken()) {
      this.$router.push('/personen');
    }
  },
});
</script>

<style scoped>

</style>
