export default defineNuxtRouteMiddleware(async (to, from) => {
  const { session } = await useSession();

  if (!session.value?.access_token) {
    return navigateTo("/");
  }
  // TODO: authStore.refreshToken();
});

