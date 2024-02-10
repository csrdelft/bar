<script lang="ts" setup>
const loading = ref(true);
const message = ref("");
const loadingProgress = ref(0);

const tijd = useDateFormat(useNow(), "HH:mm:ss", { locales: "nl-NL" });
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-toolbar-title> C.S.R. Bar </v-toolbar-title>

      <v-spacer></v-spacer>

      <span>{{ tijd }}</span>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-overlay :value="loading">
      <div class="d-flex flex-column align-center" style="width: 200px; max-width: 100%">
        <v-progress-linear :value="loadingProgress" height="10" />
        <span class="pt-2">{{ message }}</span>
      </div>
    </v-overlay>
  </v-layout>
</template>
