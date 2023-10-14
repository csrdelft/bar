<script lang="ts" setup>
import { useTypedRouter } from "~/generated";

const { router, routes } = useTypedRouter();

const handleLogout = async (e: Event) => {
  if (!(e.target instanceof HTMLFormElement)) return;
  await $fetch("/api/logout", {
    method: "POST",
    redirect: "manual",
  });
  await navigateTo("/login");
};
</script>

<template>
  <v-container>
    <v-main class="logout-main">
      <v-row justify="center">
        <h1>Weet je zeker dat je wil uitloggen?</h1>
      </v-row>

      <v-row justify="center">
        <v-col cols="auto">
          <form method="post" action="/api/logout" @submit.prevent="handleLogout">
            <input type="submit" value="Sign out" />
            <v-btn x-large type="submit" color="primary">Uitloggen </v-btn>
          </form>
        </v-col>
        <v-col cols="auto">
          <v-btn x-large @click="router.push({ name: routes.index })">Terug</v-btn>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<style scoped>
.logout-main {
  text-align: center;
}
</style>
