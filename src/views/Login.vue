<template>
  <h1><router-link to="/auth/csr">Login</router-link></h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Login',
  created(): void {
    if (this.$store.state.token) {
      this.$router.push('/personen');
    }
  },
});
</script>

<style scoped>

</style>
