<template>
<v-app>
  <v-navigation-drawer app v-model="drawer">
<v-list
        nav
        dense
      >
        <v-list-item-group act>
          <v-list-item to="/personen">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Personen</v-list-item-title>
          </v-list-item>

          <v-list-item :disabled="bestellingUrl == null" :to="bestellingUrl">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Invoer</v-list-item-title>
          </v-list-item>
          
          <v-list-item to="/bestellingen">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Bestellingen</v-list-item-title>
          </v-list-item>
          <v-list-item to="/auth/logout">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Uitloggen</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
  </v-navigation-drawer>

  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>C.S.R. Bar</v-toolbar-title>
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>

  <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
</v-app>
</template>


<script lang="ts">
import Vue from 'vue';
// import PersoonSelectie from '@/components/PersoonSelectie.vue';
// import Clock from '@/components/Clock.vue';
import { BarLocatie } from '@/model';

export default Vue.extend({
  name: 'App',
  // components: { Clock, PersoonSelectie },
  data: () => ({
    loading: true,
    drawer: false,
  }),
  computed: {
    loggedIn(): boolean {
      return Boolean(this.$store.getters.token);
    },
    currentRoute(): string {
      return this.$router.currentRoute.path;
    },
    bestellingUrl(): string|null {
      const { selectie } = this.$store.state.user;
      if (selectie) {
        return `/invoer/${selectie}`;
      }
      return null;
    },
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    },
  },
  async created() {
    if (this.loggedIn) {
      try {
        await this.$store.dispatch('postLogin');
      } finally {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
