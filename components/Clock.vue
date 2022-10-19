<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";

const date = ref(new Date());

onBeforeMount(() => {
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

