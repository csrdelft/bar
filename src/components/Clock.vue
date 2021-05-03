<template>
<span>{{tijd}}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
