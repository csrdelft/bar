<script lang="ts" setup>
const loading = ref(true);
const message = ref("");
const loadingProgress = ref(0);
const bestellingUrl = ref(undefined);

const beheer = ref(0);
const admin = ref(0);

const tijd = useDateFormat(useNow(), "HH:mm:ss", { locales: "nl-NL" });

const { session } = await useSession();
</script>

<template>
  <v-layout>
    <!-- <v-navigation-drawer v-model="drawer" permanent expand-on-hover rail> -->
    <v-navigation-drawer v-if="session?.access_token" permanent expand-on-hover rail>
      <v-list nav>
        <v-list-item prepend-icon="fas fa-home" title="Begin" to="/"> </v-list-item>
        <v-list-item prepend-icon="fas fa-user-group" title="Personen" to="/personen"> </v-list-item>
        <v-list-item :disabled="bestellingUrl == null" prepend-icon="fas fa-receipt" title="Invoer" :to="bestellingUrl">
        </v-list-item>
        <v-list-item prepend-icon="fas fa-list" title="Bestellingen" to="bestellingen"> </v-list-item>
        <v-list-item v-if="beheer || admin" prepend-icon="fas fa-wrench" title="Beheer" to="beheer"> </v-list-item>
        <v-list-item prepend-icon="fas fa-arrow-right-from-bracket" title="Uitloggen" to="logout"> </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-toolbar-title>
        C.S.R. Bar
        <span v-if="session?.locatie">- {{ session?.locatie.naam }}</span>
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

