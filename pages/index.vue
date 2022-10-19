<script lang="ts" setup>
import { BarLocatie } from "~/types/barlocatie";
import { useUserStore } from "~/stores/user";
import { computed, ref } from "vue";

const user = useUserStore();

const naam = ref("");

const profielNaam = computed((): string => {
  return user.profiel?.displayName ?? "";
});
const vertrouwd = computed((): BarLocatie | null => {
  return user.locatieToken;
});
const loggedIn = computed(() => {
  return !!user.tokenData;
});
</script>

<template>
  <v-container v-if="!loggedIn" class="login-main">
    <h1>Barsysteem C.S.R.</h1>
    <p>Welkom <span v-if="vertrouwd">terug</span> bij het barsysteem, gebruik je stek account om in te loggen.</p>
    <v-btn x-large color="primary" @click="$router.push('/auth/csr')">Login </v-btn>
  </v-container>
  <v-container v-else class="login-main">
    <h1>Welkom in het bar systeem! {{ profielNaam }}</h1>

    <v-alert prominent type="warning"
      >Deze versie van het barsyseem is in beta! Wees dus voorzichtig met waar je op klikt.
    </v-alert>

    <p>
      <v-btn x-large to="/personen">Beginnen</v-btn>
    </p>
  </v-container>
</template>

<style scoped>
.login-main {
  text-align: center;
}
</style>

