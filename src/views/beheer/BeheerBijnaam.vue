<template>
  <v-card>
    <v-card-title>Bijnaam aanpassen</v-card-title>
    <v-card-text>
      <v-autocomplete
        label="Naam"
        :items="personen"
        item-text="naam"
        item-value="socCieId"
        @change="selecteerPersoon"
        clearable
      ></v-autocomplete>
      <v-text-field label="Bijnaam" v-model="bijnaam"></v-text-field>
      <v-btn block :loading="laden" :disabled="persoon == null" @click="opslaan"
        >Opslaan</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Persoon } from "@/model";
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    persoon: null as Persoon | null,
    bijnaam: "",
    laden: false
  }),
  computed: {
    personen(): Persoon[] {
      return this.$store.getters.personenWeergave;
    }
  },
  methods: {
    selecteerPersoon(socCieId: string) {
      if (!socCieId) {
        this.persoon = null;
        this.bijnaam = "";
      } else {
        this.persoon = this.$store.state.personen[socCieId];
        this.bijnaam = this.persoon?.bijnaam ?? "";
      }
    },
    async opslaan() {
      if (!this.persoon) {
        throw new Error("Persoon niet geselecteerd");
      }

      this.laden = true;

      await this.$store.dispatch("updateBijnaam", {
        id: this.persoon.socCieId,
        name: this.bijnaam
      });

      this.laden = false;
    }
  }
});
</script>

<style scoped>
</style>