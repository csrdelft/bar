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
    <v-divider />
    <v-btn-toggle>
      <v-btn block x-large color="success" @click="emits('plaatsBestelling')" :loading="bestellingLaden">
        <v-icon icon="fas fa-check" dark />
      </v-btn>
      <v-btn block color="error" @click="emits('annuleer')" :disabled="bestellingLaden" x-large>
        <v-icon icon="fas fa-close" dark />
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

