<script lang="ts" setup>
interface Props {
  bestellingLaden: boolean;
  totaal: number;
  saldo: number;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "plaatsBestelling"): void;
  (e: "annuleer"): void;
}>();

const { bedragFormat } = useFormatter();
</script>

<template>
  <div>
    <v-list two-line>
      <v-list-item>
        <v-list-item-title>Huidig saldo</v-list-item-title>
        <v-list-item-subtitle>
          {{ bedragFormat(saldo) }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Totaal bestelling</v-list-item-title>
        <v-list-item-subtitle>
          {{ bedragFormat(totaal) }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Nieuw saldo</v-list-item-title>
        <v-list-item-subtitle>
          {{ bedragFormat(saldo - totaal) }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-row justify="center">
      <v-col cols="6">
        <v-btn block size="x-large" color="success" @click="emits('plaatsBestelling')" :loading="bestellingLaden">
          <v-icon icon="mdi-check" dark />
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block size="x-large" color="error" @click="emits('annuleer')" :disabled="bestellingLaden">
          <v-icon icon="mdi-close" dark />
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

