export default defineNuxtRouteMiddleware(async (to, from) => {
  const { session } = await useSession();

  if (!session.value?.profiel.isAdmin) {
    return navigateTo("/");
  }
});

