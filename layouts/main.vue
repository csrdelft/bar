<script lang="ts" setup>
import { usePersoonStore } from "~/stores/persoon";

const loading = ref(true);
const message = ref("");
const loadingProgress = ref(0);

const user = useAuthenticatedUser();
const session = useSession();

const tijd = useDateFormat(useNow(), "HH:mm:ss", { locales: "nl-NL" });
const persoonStore = usePersoonStore();
</script>

<template>
  <v-layout>
    <v-navigation-drawer v-if="user" permanent expand-on-hover rail>
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Begin" to="/"> </v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Personen" to="/personen">
        </v-list-item>
        <v-list-item
          :disabled="persoonStore.persoonSelectie == null"
          prepend-icon="mdi-receipt"
          title="Invoer"
          :to="`/invoer/${persoonStore.persoonSelectie}`"
        >
        </v-list-item>
        <v-list-item prepend-icon="mdi-view-list" title="Bestellingen" to="/bestellingen">
        </v-list-item>
        <v-list-item
          v-if="user.rechten.beheer || user.rechten.admin"
          prepend-icon="mdi-wrench"
          title="Beheer"
          to="/beheer"
        >
        </v-list-item>
        <v-list-item prepend-icon="mdi-exit-to-app" title="Uitloggen" to="/logout"> </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-toolbar-title>
        C.S.R. Bar
        <span v-if="session?.locatie?.token">- {{ session?.locatie?.naam }}</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <span>{{ tijd }}</span>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-overlay :value="loading">
      <div class="d-flex flex-column align-center" style="width: 200px; max-width: 100%">
        <v-progress-linear :value="loadingProgress" height="10"> </v-progress-linear>
        <span class="pt-2">{{ message }}</span>
      </div>
    </v-overlay>
  </v-layout>
</template>
