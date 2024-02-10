export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  const session = useSession();

  const { data: userData } = await useFetch("/api/user");
  const { data: sessionData } = await useFetch("/api/session");
  if (userData.value && sessionData.value) {
    user.value = userData.value;
    session.value = sessionData.value;
  }
});
