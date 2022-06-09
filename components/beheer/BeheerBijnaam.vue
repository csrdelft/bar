<script lang="ts" setup>
import { computed, ref } from "vue";
import { Persoon } from "../../model";
import { usePersoonStore } from "../../stores/persoon";

const persoon = usePersoonStore();

const huidigePersoon = ref<Persoon | null>(null);
const bijnaam = ref("");
const laden = ref(false);

const personen = computed(() => {
  return persoon.personenWeergave;
});

const selecteerPersoon = (uid: string) => {
  if (!uid) {
    huidigePersoon.value = null;
    bijnaam.value = "";
  } else {
    huidigePersoon.value = persoon.personen[uid];
    bijnaam.value = huidigePersoon.value?.naam ?? "";
  }
};
const opslaan = async () => {
  if (!huidigePersoon.value) {
    throw new Error("Persoon niet geselecteerd");
  }

  laden.value = true;

  await persoon.updateBijnaam({
    id: huidigePersoon.value.uid,
    name: bijnaam.value,
  });

  laden.value = false;
};
</script>

<template>
  <v-card>
    <v-card-title>Bijnaam aanpassen</v-card-title>
    <v-card-text>
      <v-autocomplete
        label="Naam"
        :items="personen"
        item-key="uid"
        item-text="weergave"
        item-value="uid"
        @update:model-value="selecteerPersoon"
        clearable
      ></v-autocomplete>
      <v-text-field label="Bijnaam" v-model="bijnaam"></v-text-field>
      <v-btn block :loading="laden" :disabled="huidigePersoon == null" @click="opslaan"> Opslaan </v-btn>
    </v-card-text>
  </v-card>
</template>

