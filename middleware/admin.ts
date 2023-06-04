import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = await useUserStore();

  if (!userStore.rechten.admin) {
    return navigateTo("/");
  }
});

