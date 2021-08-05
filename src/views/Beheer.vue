<template>
  <v-row>
    <v-col cols="4">
      <beheer-bijnaam v-if="isBeheer" />
    </v-col>
    <v-col cols="4">
      <beheer-vertrouw v-if="isAdmin" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import BeheerBijnaam from "./beheer/BeheerBijnaam.vue";
import BeheerVertrouw from "./beheer/BeheerVertrouw.vue";
export default Vue.extend({
  components: { BeheerBijnaam, BeheerVertrouw },
  computed: {
    scopes() {
      return this.$store.state.user.profiel?.scopes ?? [];
    },
    isBeheer(): boolean {
      return this.scopes.includes("BAR:BEHEER");
    },
    isAdmin(): boolean {
      return this.scopes.includes("BAR:TRUST");
    }
  }
});
</script>

<style scoped>
</style>