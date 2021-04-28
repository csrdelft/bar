<template>
  <div>Redirecting</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import csrAuth from '../../auth/csrAuth';

/**
 * Open autorisatie in een nieuw venster en ga terug naar /
 * Ga direct terug naar / als er al een profiel is.
 */
export default defineComponent({
  name: 'Authorize',
  created(): void {
    if (!this.$store.state.token) {
      window.open(csrAuth.token.getUri());
    }
    this.$router.push('/');
  },
});
</script>

<style scoped>

</style>
