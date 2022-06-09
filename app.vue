<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { BarLocatie, Rechten } from "./model";
import Clock from "./components/Clock.vue";
import { useUserStore } from "./stores/user";
import { usePersoonStore } from "./stores/persoon";
import { useMainStore } from "./stores";
import { useToken } from "./composables/useToken";

const user = useUserStore();
const persoon = usePersoonStore();
const main = useMainStore();

const loading = ref(true);
const drawer = ref(false);
const loadingMessage = ref("");
const loadingProgress = ref(0);

const loggedIn = computed((): boolean => {
  return !!user.token;
});
const bestellingUrl = computed((): string | null => {
  if (user.selectie) {
    return `/invoer/${user.selectie}`;
  }
  return null;
});
const vertrouwd = computed((): BarLocatie | null => {
  return user.locatieToken;
});

watch(loggedIn, async () => {
  await processLogin();
});

const setLoading = async (progress: number, message: string): Promise<void> => {
  loading.value = false;
  loadingMessage.value = message;
  loadingProgress.value = progress;

  loading.value = true;
};

const processLogin = async () => {
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
};

onBeforeMount(async () => {
  const { setupToken } = useToken();
  await setupToken();

  await processLogin();
});
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

          <v-list-item :disabled="bestellingUrl == null" :to="{ path: bestellingUrl || '' }">
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
        <span v-if="vertrouwd">- {{ vertrouwd.naam }}</span>
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
        <span class="pt-2">{{ loadingMessage }}</span>
      </div>
    </v-overlay>
  </v-app>
</template>

