export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  const session = useSession();

  const userData = await $fetch("/api/user");
  const sessionData = await $fetch("/api/session");
  if (userData && sessionData) {
    user.value = userData;
    session.value = sessionData;
  }
});
