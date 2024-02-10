export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUser();
  if (!user.value?.rechten.beheer) {
    return navigateTo("/");
  }
});
