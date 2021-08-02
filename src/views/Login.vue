<template>
  <v-container>
    <v-main class="login-main">
      <h1>Barsysteem C.S.R.</h1>
      <p>Welkom <span v-if="vertrouwd">terug</span>
       bij het barsysteem, gebruik je stek account om in te loggen.</p>
      <v-btn @click="$router.push('/auth/csr')">Login</v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Login',
  computed: {
    vertrouwd() {
      return !!this.$store.state.user.locatieToken;
    },
  },
  created(): void {
    if (this.$store.state.user.tokenData) {
      this.$router.push('/personen');
    }
  },
});
</script>

<style scoped>
.login-main {
  text-align: center;
}
</style>
