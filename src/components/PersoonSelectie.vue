<template>
  <h2 class="persoon-selectie" :style="{background: kleur}">{{naam}}</h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PersoonSelectie',
  computed: {
    naam() {
      const persoon = this.$store.state.selectie;

      if (persoon) {
        return persoon.naam;
      }

      return 'Geen persoon geselecteerd';
    },
    kleur() {
      const persoon = this.$store.state.selectie;

      if (!persoon) {
        return '#bce8f1';
      }

      if (Number(persoon.saldo) < 0) {
        return '#f2dede';
      }

      return '#f0f9eb';
    },
  },
});
</script>

<style scoped>
.persoon-selectie {
  padding: 2em;
  margin: 0;
}
</style>
