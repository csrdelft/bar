export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = useSession();
  if (!session.value?.user.rechten.beheer) {
    return navigateTo("/");
  }
});
