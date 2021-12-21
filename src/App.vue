<template>
  <v-app>
    <v-navigation-drawer
        app
        v-model="drawer"
        permanent
        expand-on-hover
        v-if="loggedIn && !loading"
    >
      <v-list nav dense>
        <v-list-item-group act>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Begin</v-list-item-title>
          </v-list-item>
          <v-list-item to="/personen">
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Personen</v-list-item-title>
          </v-list-item>

          <v-list-item :disabled="bestellingUrl == null" :to="bestellingUrl">
            <v-list-item-icon>
              <v-icon>mdi-receipt</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Invoer</v-list-item-title>
          </v-list-item>

          <v-list-item to="/bestellingen">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Bestellingen</v-list-item-title>
          </v-list-item>
          <v-list-item to="/beheer" v-if="rechten.beheer || rechten.admin">
            <v-list-item-icon>
              <v-icon>mdi-wrench</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Beheer</v-list-item-title>
          </v-list-item>
          <v-list-item to="/logout">
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Uitloggen</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>
        C.S.R. Bar
        <span v-if="vertrouwd">- {{ vertrouwd.naam }}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <clock/>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-overlay :value="loading">
      <div class="d-flex flex-column align-center" style="width: 200px; max-width: 100%;">
        <v-progress-linear :value="loadingProgress" height="10"></v-progress-linear>
        <span class="pt-2">{{ msg }}</span>
      </div>
    </v-overlay>
  </v-app>
</template>


<script lang="ts">
import Vue from "vue";
import {BarLocatie, Rechten} from "@/model";
import Clock from "./components/Clock.vue";

export default Vue.extend({
  components: {Clock},
  name: "App",
  data: () => ({
    loading: true,
    drawer: false,
    msg: "",
    loadingProgress: 0,
  }),
  computed: {
    rechten(): Rechten {
      return this.$store.getters.rechten;
    },
    loggedIn(): boolean {
      return Boolean(this.$store.getters.token);
    },
    bestellingUrl(): string | null {
      const {selectie} = this.$store.state.user;
      if (selectie) {
        return `/invoer/${selectie}`;
      }
      return null;
    },
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    }
  },
  watch: {
    async loggedIn() {
      await this.processLogin()
    }
  },
  methods: {
    async setLoading(progress: number, msg: string): Promise<void> {
      this.loading = false;
      this.msg = msg;
      this.loadingProgress = progress;
      // NextTick om er voor te zorgen dat loading update
      await this.$nextTick();
      this.loading = true;
    },
    async processLogin() {
      if (this.loggedIn) {
        try {
          await this.setLoading(25, "Profiel laden...");
          await this.$store.dispatch('fetchProfiel');
          await this.setLoading(50, "Leden laden...");
          await this.$store.dispatch('listUsers');
          await this.setLoading(75, "Producten laden...");
          await this.$store.dispatch('listProducten');
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  },
  async created() {
    await this.processLogin()
  }
});
</script>

<style lang="scss">
</style>
