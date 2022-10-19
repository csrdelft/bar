export default defineNuxtRouteMiddleware((to, from) => {
  const { getToken } = useToken();
  const token = getToken();

  if (!token) {
    navigateTo({ path: "/" });
    return;
  }
});

