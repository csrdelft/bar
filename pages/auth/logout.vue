<script lang="ts" setup>
import { useUserStore } from "~/stores/user";
import { useTypedRouter } from "~/generated";

const { router, routes } = useTypedRouter();

const user = useUserStore();

onMounted(() => {
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

