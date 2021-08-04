<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      permanent
      expand-on-hover
      v-if="loggedIn"
    >
      <v-list nav dense>
        <v-list-item-group act>
          <v-list-item to="/">
            <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
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
          <v-list-item to="/beheer">
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
        <v-list-item>
          <v-list-item-icon></v-list-item-icon>
          <v-list-item-title>
            <v-switch
              v-model="$vuetify.theme.dark"
              hint="Schakelt tussen licht en donker thema"
              inset
              label="Donker thema"
              persistent-hint
            ></v-switch>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="loggedIn"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title
        >C.S.R. Bar
        <span v-if="vertrouwd">- {{ vertrouwd.naam }}</span></v-toolbar-title
      >

      <v-spacer></v-spacer>

      <clock />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>


<script lang="ts">
import Vue from "vue";
import { BarLocatie } from "@/model";
import Clock from "./components/Clock.vue";

export default Vue.extend({
  components: { Clock },
  name: "App",
  // components: { Clock, PersoonSelectie },
  data: () => ({
    loading: true,
    drawer: false
  }),
  computed: {
    loggedIn(): boolean {
      return Boolean(this.$store.getters.token);
    },
    bestellingUrl(): string | null {
      const { selectie } = this.$store.state.user;
      if (selectie) {
        return `/invoer/${selectie}`;
      }
      return null;
    },
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    }
  },
  async created() {
    if (this.loggedIn) {
      try {
        await this.$store.dispatch("postLogin");
      } finally {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }
});
</script>

<style lang="scss">
</style>
