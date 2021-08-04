<template>
  <v-container>
    <v-main class="logout-main">
      <h1>Weet je zeker dat je wil uitloggen?</h1>
      <v-btn-toggle>
      <v-btn x-large @click="logout" color="primary">Uitloggen</v-btn>
      <v-btn x-large @click="$router.push('/')">Terug</v-btn>
      </v-btn-toggle>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Logout",
  methods: {
    logout(): void {
      this.$router.push("/auth/logout");
    }
  }
});
</script>

<style scoped>
.logout-main {
  text-align: center;
}
</style>
