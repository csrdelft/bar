<template>
  <div>
    <v-list two-line>
      <v-list-item>
        <v-list-item-title>Huidig saldo</v-list-item-title>
        <v-list-item-subtitle>
          {{ format(saldo) }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Totaal bestelling</v-list-item-title>
        <v-list-item-subtitle>
          {{ format(totaal) }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Nieuw saldo</v-list-item-title>
        <v-list-item-subtitle>
          {{ format(saldo - totaal) }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider/>
    <v-btn-toggle>
      <v-btn
          block
          x-large
          color="success"
          @click="plaatsBestelling"
          :loading="bestellingLaden"
      >
        <v-icon dark>mdi-check</v-icon>
      </v-btn>
      <v-btn
          block
          color="error"
          @click="annuleer"
          :disabled="bestellingLaden"
          x-large
      >
        <v-icon dark>mdi-close</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {format} from "@/util/bedrag";

export default Vue.extend({
  name: "BestellingSamenvatting",
  props: {
    bestellingLaden: Boolean,
    totaal: Number,
    plaatsBestelling: Function,
    annuleer: Function,
    saldo: Number,
  },
  methods: {
    format
  }
});
</script>

<style scoped>
</style>
