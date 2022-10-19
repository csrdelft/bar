<script lang="ts" setup>
import { onBeforeMount, onMounted } from "vue";
import { useUserStore } from "~/stores/user";
import { useTypedRouter } from "~/generated";

const { router, routes } = useTypedRouter();

const user = useUserStore();

onBeforeMount(() => {
  user.setToken(null);
  router.push({ name: routes.index });
});
</script>

<template>
  <v-container>
    <v-main>
      <h1>Uitloggen...</h1>
    </v-main>
  </v-container>
</template>

