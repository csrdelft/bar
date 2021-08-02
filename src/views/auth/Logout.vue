<template>
  <v-container>
    <v-main class="logout-main">
      <h1>Weet je zeker dat je wil uitloggen?</h1>
      <v-btn @click="logout" type="primary">Uitloggen</v-btn>
      <v-btn @click="$router.push('/')">Terug</v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Logout',
  methods: {
    logout(): void {
      this.$store.commit('setToken', null);
      this.$router.push('/');
    },
  },
});
</script>

<style scoped>
.logout-main {
  text-align: center;
}
</style>
