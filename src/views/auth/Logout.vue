<template>
  <div><h1>Uitgelogd</h1><router-link to="/auth/csr">Login</router-link></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { removeToken } from '@/token';

export default defineComponent({
  name: 'Logout',
  created(): void {
    removeToken();
  },
});
</script>

<style scoped>

</style>
