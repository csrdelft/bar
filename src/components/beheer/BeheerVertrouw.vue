<template>
  <v-card>
    <v-card-title>Locatie vertrouwen</v-card-title>
    <v-card-text>
      <div v-if="vertrouwd">
        <p><strong>{{ vertrouwd.naam }}</strong> is een vertrouwde locatie. Alle leden kunnen gebruik maken van het bar systeem op deze
          locatie.
        </p>

        <v-btn color="primary" @click="stopVertrouwen">
          Niet langer vertrouwen
        </v-btn>
      </div>

      <div v-else>
        <p>
          Door een locatie te vertrouwen wordt het mogelijk voor alle leden om
          in te loggen in het bar systeem. Gebruik deze functie alleen op
          vertrouwde plekken.
        </p>
        <p>
          <v-text-field v-model="naam" label="Naam van deze locatie" @keydown="$event.key === 'Enter' && vertrouw()"/>
          <v-btn block color="primary" @click="vertrouw" :loading="laden" :disabled="naam.length === 0">
            Vertrouw deze locatie
          </v-btn>
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {BarLocatie} from "@/model";
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    naam: "",
    laden: false
  }),
  computed: {
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    }
  },
  methods: {
    async vertrouw() {
      this.laden = true;
      await this.$store.dispatch("vertrouwLocatie", this.naam);
      this.laden = false;
    },
    async stopVertrouwen() {
      this.$store.commit("setLocatieToken", null);
    }
  }
});
</script>
