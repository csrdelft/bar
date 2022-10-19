<script lang="ts" setup>
import { useTypedRouter } from "~/generated";

const { router, routes } = useTypedRouter();

const logout = () => {
  router.push({ name: routes.authLogout });
};
</script>

<template>
  <v-container>
    <v-main class="logout-main">
      <h1>Weet je zeker dat je wil uitloggen?</h1>
      <v-btn-toggle>
        <v-btn x-large @click="logout" color="primary">Uitloggen</v-btn>
        <v-btn x-large @click="router.push({ name: routes.index })">Terug</v-btn>
      </v-btn-toggle>
    </v-main>
  </v-container>
</template>

<style scoped>
.logout-main {
  text-align: center;
}
</style>

