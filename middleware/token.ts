import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (!authStore.token?.accessToken) {
    return navigateTo("/");
  } else if (authStore.token?.expiresAt! < Date.now()) {
    await authStore.refreshToken();
    return;
  }
});

