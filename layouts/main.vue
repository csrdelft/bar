<script lang="ts" setup>
const loading = ref(true);
const drawer = ref(true);
const message = ref("");
const loadingProgress = ref(0);
const bestellingUrl = ref(null);

const beheer = ref(0);
const admin = ref(0);
</script>

<template>
  <v-layout>
    <v-app-bar>
      <v-toolbar-title>
        C.S.R. Bar
        <!-- <span v-if="user.locatieToken">- {{ user.locatieToken.naam }}</span> -->
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <clock />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" expand-on-hover rail>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="fa-home" title="Begin" to="/"> </v-list-item>
        <v-list-item prepend-icon="fa-user-group" title="Personen" to="/personen"> </v-list-item>
        <v-list-item :disabled="bestellingUrl == null" prepend-icon="fa-receipt" title="Invoer" :to="bestellingUrl">
        </v-list-item>
        <v-list-item prepend-icon="fa-list" title="Bestellingen" to="bestellingen"> </v-list-item>
        <v-list-item v-if="beheer || admin" prepend-icon="fa-wrench" title="Beheer" to="beheer"> </v-list-item>
        <v-list-item prepend-icon="fa-arrow-right-from-bracket" title="Uitloggen" to="logout"> </v-list-item>
      </v-list>
    </v-navigation-drawer>

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

