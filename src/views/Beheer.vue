<template>
  <v-row>
    <v-col lg="4" v-if="rechten.beheer">
      <beheer-bijnaam />
    </v-col>
    <v-col lg="4" v-if="rechten.admin">
      <beheer-vertrouw />
    </v-col>
    <v-col lg="4" v-if="!rechten.beheer && !rechten.admin">
      Er is niets te zien hier.
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import BeheerBijnaam from "../components/beheer/BeheerBijnaam.vue";
import BeheerVertrouw from "../components/beheer/BeheerVertrouw.vue";
import {Rechten} from "@/model";

export default Vue.extend({
  components: { BeheerBijnaam, BeheerVertrouw },
  computed: {
    rechten(): Rechten {
      return this.$store.getters.rechten;
    },
  }
});
</script>

<style scoped>
</style>
