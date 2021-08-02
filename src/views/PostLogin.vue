<template>
<div>
  <h1>Welkom in het bar systeem! {{ profielNaam }}</h1>

  <div v-if="isAdmin">
    <div v-if="vertrouwd">
      <p>Deze locatie is vertrouwd: {{ vertrouwd.naam }}</p>

      <v-btn color="primary" @click="stopVertrouwen">
        Deze locatie niet langer vertrouwen.
      </v-btn>
    </div>

    <div v-else>
      <p>
        Door een locatie te vertrouwen wordt het mogelijk voor alle leden om in te
        loggen in het bar systeem. Gebruik deze functie alleen op vertrouwde
        plekken.
      </p>
      <p>
        <v-text-field v-model="naam" label="Naam van deze locatie" />
        <v-btn color="primary" @click="vertrouw">Vertrouw deze locatie</v-btn>
      </p>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { BarLocatie } from '../model';

export default Vue.extend({
  name: 'PostLogin',
  data: () => ({
    naam: '',
  }),
  computed: {
    profielNaam(): string {
      return this.$store.state.user.profiel?.displayName ?? '';
    },
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    },
    isAdmin(): boolean {
      return this.$store.state.user.profiel?.scopes.includes('BAR:TRUST') ?? false;
    },
  },
  methods: {
    vertrouw() {
      this.$store.dispatch('vertrouwLocatie', this.naam);
    },
    stopVertrouwen() {
      this.$store.commit('setLocatieToken', null);
    },
  },
});
</script>

<style scoped>
</style>
