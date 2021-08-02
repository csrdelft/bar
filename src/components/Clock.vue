<template>
<span>{{tijd}}</span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Clock',
  data: () => ({
    date: new Date(),
  }),
  created() {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  },
  computed: {
    tijd(): string {
      return this.date.toLocaleTimeString('nl-NL');
    },
  },
});
</script>

<style scoped>

</style>
