<script lang="ts" setup>
import { useTypedRouter } from "~/generated";
import { useAuthStore } from "~/stores/auth";

const { router, routes } = useTypedRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.signOut();
  // router.push({ name: routes.authLogout });
  router.push({ name: routes.index });
};
</script>

<template>
  <v-container>
    <v-main class="logout-main">
      <v-row justify="center">
        <h1>Weet je zeker dat je wil uitloggen?</h1>
      </v-row>

      <v-row justify="center">
        <v-col cols="auto">
          <v-btn x-large @click="logout" color="primary">Uitloggen</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn x-large @click="router.push({ name: routes.index })">Terug</v-btn>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<style scoped>
.logout-main {
  text-align: center;
}
</style>

