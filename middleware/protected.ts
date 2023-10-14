export default defineNuxtRouteMiddleware(async () => {
  const session = useSession();
  if (!session.value) return navigateTo("/login");
});
