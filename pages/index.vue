<script lang="ts" setup>
import { useAuthStore } from "~/stores/auth";
import { useTypedRouter } from "~~/generated";

const { session, refresh, update, reset } = await useSession();
const { router, routes } = useTypedRouter();

const authStore = useAuthStore();
</script>

<template>
  <v-container v-if="!session?.access_token" class="login-main">
    <h1>Barsysteem C.S.R.</h1>
    <p>Welkom <span v-if="vertrouwd">terug</span> bij het barsysteem, gebruik je stek account om in te loggen.</p>
    <!-- <v-btn x-large color="primary" @click="() => router.push({ name: routes.authCsr })">Login </v-btn> -->
    <v-btn x-large color="primary" @click="() => authStore.authorize()">Login </v-btn>
  </v-container>
  <v-container v-else class="login-main">
    <!-- <h1>Welkom in het bar systeem! {{ profielNaam }}</h1> -->
    <h1>Welkom in het bar systeem!</h1>

    <v-alert prominent type="warning">
      Deze versie van het barsyseem is in beta! Wees dus voorzichtig met waar je op klikt.
    </v-alert>

    <NuxtLink to="/personen">
      <v-btn x-large>Beginnen</v-btn>
    </NuxtLink>
  </v-container>
</template>

<style scoped>
.login-main {
  text-align: center;
}
</style>

