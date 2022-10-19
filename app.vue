<script lang="ts" setup>
import { BarLocatie } from "~/types/barlocatie";
import { Rechten } from "~/types/rechten";
import Clock from "./components/Clock.vue";
import { useMainStore } from "./stores";
import { usePersoonStore } from "./stores/persoon";
import { useUserStore } from "./stores/user";

const main = useMainStore();
const user = useUserStore();
const persoon = usePersoonStore();

const loading = ref(true);
const drawer = ref(false);
const message = ref("");
const loadingProgress = ref(0);

const loggedIn = computed(() => Boolean(user.token));
const bestellingUrl = computed(() => {
  if (user.selectie) {
    return `/invoer/${user.selectie}`;
  }
  return null;
});

async function setLoading(progress: number, msg: string) {
  loading.value = false;
  message.value = msg;
  loadingProgress.value = progress;
  // NextTick om er voor te zorgen dat loading update
  await nextTick();
  loading.value = true;
}
async function processLogin() {
  if (loggedIn) {
    try {
      await setLoading(25, "Profiel laden...");
      await user.fetchProfiel();
      await setLoading(50, "Leden laden...");
      await persoon.listUsers();
      await setLoading(75, "Producten laden...");
      await main.listProducten();
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

// FIXME:
// watch(
//   () => user.token,
//   () => {
//     processLogin();
//   }
// );

// onMounted(async () => {
//   await processLogin();
// });
</script>

<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" permanent expand-on-hover v-if="loggedIn && !loading">
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
          <v-list-item to="/beheer" v-if="user.rechten.beheer || user.rechten.admin">
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
        <span v-if="user.locatieToken">- {{ user.locatieToken.naam }}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <clock />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <NuxtPage />
      </v-container>
    </v-main>

    <v-overlay :value="loading">
      <div class="d-flex flex-column align-center" style="width: 200px; max-width: 100%">
        <v-progress-linear :value="loadingProgress" height="10"></v-progress-linear>
        <span class="pt-2">{{ message }}</span>
      </div>
    </v-overlay>
  </v-app>
</template>

