<template>
  <div class="home">
    <Overzicht />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Overzicht from '@/components/Overzicht.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    Overzicht,
  },
});
</script>
