<template>
  <h2 class="persoon-selectie" :style="{background: kleur}">{{naam}}</h2>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PersoonSelectie',
  computed: {
    naam() {
      const { selectie } = this.$store.state.user;

      if (!selectie) {
        return 'Geen persoon geselecteerd';
      }

      const persoon = this.$store.state.personen[selectie];

      if (!persoon) {
        return 'Laden';
      }

      return persoon.naam;
    },
    kleur() {
      const { selectie } = this.$store.state.user;

      if (!selectie) {
        return '#bce8f1';
      }

      const persoon = this.$store.state.personen[selectie];

      if (!persoon) {
        return '';
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
  padding: 1em 2em;
  margin: 0;
}
</style>
