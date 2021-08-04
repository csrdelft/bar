<template>
  <v-row>
    <v-col cols="4">
      <beheer-bijnaam v-if="isBeheer" />
    </v-col>
    <v-col cols="4">
      <beheer-vertrouw v-if="isBeheer" />
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
    isBeheer(): boolean {
      return (
        this.$store.state.user.profiel?.scopes.includes("BAR:BEHEER") ?? false
      );
    }
  }
});
</script>

<style scoped>
</style>