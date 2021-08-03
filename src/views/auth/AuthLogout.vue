<template>
  <v-container>
    <v-main>
      <h1>Uitloggen...</h1>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Logout",
  created(): void {
    this.$store.commit("setToken", null);
    this.$router.push("/");
  }
});
</script>

<style scoped>
</style>
