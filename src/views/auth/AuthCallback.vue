<template>
  <div>Redirecting back</div>
</template>

<script lang="ts">

import Vue from 'vue';

/**
 * Roept oauth2Callback aan op de opener, hiermee wordt
 * de originele tab geïnformeerd over de autorisatie.
 */
export default Vue.extend({
  name: 'AuthCallback',
  created(): void {
    if (window.opener) window.opener.oauth2Callback(window.location.href);
    window.close();
  },
});
</script>

<style scoped>

</style>
