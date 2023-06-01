<script lang="ts" setup>
import Keyboard from "~/components/Keyboard.vue";
import LedenTable from "~/components/LedenTable.vue";

const query = ref("");
const upperValue = computed(() => query.value.toUpperCase());
const change = (value: string) => {
  query.value = value;
};

definePageMeta({
  middleware: ["token"],
});

const henk = async () => {
  const data = await fetchAuthorized("/api/v3/personen");
};
</script>

<template>
  <Keyboard v-model="query" placeholder="Zoeken" :grab-focus="true" />
  <LedenTable :zoeken="query" />
</template>

<style>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-table .error-row td:last-child {
  background: #f2dede;
}

.el-table .success-row td:last-child {
  background: #f0f9eb;
}
</style>

