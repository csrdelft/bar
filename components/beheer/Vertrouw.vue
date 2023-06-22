<script lang="ts" setup>
import { computed, ref } from "vue";
import { useMainStore } from "~/stores";
import { useAuthStore } from "~/stores/auth";
import { useUserStore } from "~/stores/user";

const authStore = useAuthStore();

const naam = ref("");
const laden = ref(false);

const vertrouw = async () => {
  laden.value = true;

  await authStore.vertrouwLocatie(naam.value);

  laden.value = false;
};
const stopVertrouwen = async () => {
  authStore.locatieToken = null;
};
</script>

<template>
  <v-card>
    <v-card-title>Locatie vertrouwen</v-card-title>
    <v-card-text>
      <div v-if="authStore.locatieToken">
        <p>
          <strong>{{ authStore.locatieToken.naam }}</strong> is een vertrouwde locatie. Alle leden kunnen gebruik maken
          van het bar systeem op deze locatie.
        </p>

        <v-btn color="primary" @click="stopVertrouwen"> Niet langer vertrouwen </v-btn>
      </div>

      <div v-else>
        <p>
          Door een locatie te vertrouwen wordt het mogelijk voor alle leden om in te loggen in het bar systeem. Gebruik
          deze functie alleen op vertrouwde plekken.
        </p>
        <p>
          <v-text-field v-model="naam" label="Naam van deze locatie" @keydown="$event.key === 'Enter' && vertrouw()" />
          <v-btn block color="primary" @click="vertrouw" :loading="laden" :disabled="naam.length === 0">
            Vertrouw deze locatie
          </v-btn>
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

