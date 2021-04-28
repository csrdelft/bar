<template>
  <div>Redirecting back</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

/**
 * Roept oauth2Callback aan op de opener, hiermee wordt
 * de originele tab geïnformeerd over de autorisatie.
 */
export default defineComponent({
  name: 'AuthCallback',
  created(): void {
    window.opener.oauth2Callback(window.location);
    window.close();
  },
});
</script>

<style scoped>

</style>
