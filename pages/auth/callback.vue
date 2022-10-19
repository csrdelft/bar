<script lang="ts" setup>
/**
 * Roept oauth2Callback aan op de opener, hiermee wordt
 * de originele tab geïnformeerd over de autorisatie.
 */
onMounted(() => {
  if (window.opener) window.opener.oauth2Callback(window.location.href);
  window.close();
});
</script>

<template>
  <div>Redirecting back</div>
</template>

