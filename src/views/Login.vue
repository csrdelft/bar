<template>
  <v-container v-if="!loggedIn" class="login-main">
    <h1>Barsysteem C.S.R.</h1>
    <p>
      Welkom <span v-if="vertrouwd">terug</span> bij het barsysteem, gebruik je
      stek account om in te loggen.
    </p>
    <v-btn @click="$router.push('/auth/csr')">Login</v-btn>
  </v-container>
  <v-container v-else class="login-main">
    <h1>Welkom in het bar systeem! {{ profielNaam }}</h1>

    <p>
      <v-btn x-large to="/personen">Beginnen</v-btn>
    </p>

    <div v-if="isAdmin">
      <div v-if="vertrouwd">
        <p>Deze locatie is vertrouwd: {{ vertrouwd.naam }}</p>

        <v-btn color="primary" @click="stopVertrouwen">
          Deze locatie niet langer vertrouwen.
        </v-btn>
      </div>

      <div v-else>
        <p>
          Door een locatie te vertrouwen wordt het mogelijk voor alle leden om
          in te loggen in het bar systeem. Gebruik deze functie alleen op
          vertrouwde plekken.
        </p>
        <p>
          <v-text-field v-model="naam" label="Naam van deze locatie" />
          <v-btn color="primary" @click="vertrouw">Vertrouw deze locatie</v-btn>
        </p>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { BarLocatie } from "@/model";
import Vue from "vue";

export default Vue.extend({
  name: "Login",
  data: () => ({
    naam: ""
  }),
  computed: {
    profielNaam(): string {
      return this.$store.state.user.profiel?.displayName ?? "";
    },
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    },
    isAdmin(): boolean {
      return (
        this.$store.state.user.profiel?.scopes.includes("BAR:TRUST") ?? false
      );
    },
    loggedIn() {
      return !!this.$store.state.user.tokenData;
    }
  },
  methods: {
    vertrouw() {
      this.$store.dispatch("vertrouwLocatie", this.naam);
    },
    stopVertrouwen() {
      this.$store.commit("setLocatieToken", null);
    }
  }
});
</script>

<style scoped>
.login-main {
  text-align: center;
}
</style>
