<script lang="ts" setup>
const user = useAuthenticatedUser();
</script>

<template>
  <v-container class="login-main">
    <h1>
      Welkom in het bar systeem!
      {{ user?.name }}
    </h1>

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
