export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUser();
  if (!user.value?.rechten.admin) {
    return navigateTo("/");
  }
});
