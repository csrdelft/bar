<template>
  <div><h1>Uitgelogd</h1><router-link to="/auth/csr">Login</router-link></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Logout',
  created(): void {
    this.$store.commit('invalidateToken');
  },
});
</script>

<style scoped>

</style>
