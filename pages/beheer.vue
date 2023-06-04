<script lang="ts" setup>
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

definePageMeta({
  middleware: ["token", "admin"],
});
</script>

<template>
  <v-row>
      <beheer-bijnaam />
    <v-col lg="4" v-if="userStore.rechten.beheer">
    </v-col>
      <beheer-vertrouw />
    <v-col lg="4" v-if="userStore.rechten.admin">
    </v-col>
    <v-col lg="4" v-if="!userStore.rechten.beheer && !userStore.rechten.admin"> Er is niets te zien hier. </v-col>
  </v-row>
</template>

