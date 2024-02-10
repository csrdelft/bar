<script lang="ts" setup>
const user = useAuthenticatedUser();

definePageMeta({
  layout: "main",
  middleware: ["protected"],
});
</script>

<template>
  <v-row>
    <v-col lg="4" v-if="user?.rechten.beheer">
      <BeheerBijnaam />
    </v-col>
    <v-col lg="4" v-if="user?.rechten.admin">
      <BeheerVertrouw />
    </v-col>
    <v-col lg="4" v-if="!user?.rechten.beheer && !user?.rechten.admin">
      Er is niets te zien hier.
    </v-col>
  </v-row>
</template>
