<script lang="ts" setup>
import BeheerBijnaam from "~/components/beheer/BeheerBijnaam.vue";
import BeheerVertrouw from "~/components/beheer/BeheerVertrouw.vue";

const user = { rechten: { beheer: true, admin: false } };

definePageMeta({
  middleware: ["token", "admin"],
});
</script>

<template>
  <v-row>
    <v-col lg="4" v-if="user.rechten.beheer">
      <beheer-bijnaam />
    </v-col>
    <v-col lg="4" v-if="user.rechten.admin">
      <beheer-vertrouw />
    </v-col>
    <v-col lg="4" v-if="!user.rechten.beheer && !user.rechten.admin"> Er is niets te zien hier. </v-col>
  </v-row>
</template>

