<script lang="ts" setup>
const date = ref(new Date());

onMounted(() => {
  setInterval(() => {
    date.value = new Date();
  }, 1000);
});

const tijd = computed((): string => {
  return date.value.toLocaleTimeString("nl-NL");
});
</script>

<template>
  <span>{{ tijd }}</span>
</template>

