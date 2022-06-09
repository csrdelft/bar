<script lang="ts" setup>
import { useUserStore } from "../stores/user";
import BeheerBijnaam from "../components/beheer/BeheerBijnaam.vue";
import BeheerVertrouw from "../components/beheer/BeheerVertrouw.vue";

const { rechten } = useUserStore();
</script>

<template>
  <v-row>
    <v-col lg="4" v-if="rechten.beheer">
      <beheer-bijnaam />
    </v-col>
    <v-col lg="4" v-if="rechten.admin">
      <beheer-vertrouw />
    </v-col>
    <v-col lg="4" v-if="!rechten.beheer && !rechten.admin"> Er is niets te zien hier. </v-col>
  </v-row>
</template>

