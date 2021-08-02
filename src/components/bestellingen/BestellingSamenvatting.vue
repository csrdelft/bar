<template>
<div>
  <v-list two-line>
    <v-list-item>
      <v-list-item-title>Huidig saldo</v-list-item-title>
      <v-list-item-subtitle>{{ formatBedrag(persoon.saldo) }}</v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <v-list-item-title>Totaal bestelling</v-list-item-title>
      <v-list-item-subtitle>{{ formatBedrag(totaal) }}</v-list-item-subtitle>
    </v-list-item>
    <v-list-item>
      <v-list-item-title>Nieuw saldo</v-list-item-title>
      <v-list-item-subtitle>{{ formatBedrag(persoon.saldo - totaal) }}</v-list-item-subtitle>
    </v-list-item>
  </v-list>
  <v-divider />
  <!-- <div>
    <span> Huidig saldo: </span>
    <span :style="{ float: 'right' }">
      {{ formatBedrag(persoon.saldo) }}
    </span>
  </div>
  <v-divider />
  <span>
    Totaal bestelling:
    <span :style="{ float: 'right' }">{{ formatBedrag(totaal) }}</span>
  </span>
  <v-divider />
  <span>
    Nieuw Saldo:
    <span :style="{ float: 'right' }">{{
      formatBedrag(persoon.saldo - totaal)
    }}</span>
  </span>
  <v-divider /> -->
  <div>
    <v-btn
      color="success"
      @click="plaatsBestelling"
      :loading="bestellingLaden"
    >
    <v-icon dark>mbi-check</v-icon>
    </v-btn>
    <v-btn
      color="error"
      @click="annuleer"
      :disabled="bestellingLaden"
    >
    <v-icon dark>mbi-close</v-icon>
    </v-btn>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { formatBedrag } from '../../util';

export default Vue.extend({
  name: 'BestellingSamenvatting',
  props: {
    bestellingLaden: Boolean,
    persoon: Object,
    totaal: Number,
    plaatsBestelling: Function,
    annuleer: Function,
  },
  methods: {
    formatBedrag,
  },
});
</script>

<style scoped>
</style>
