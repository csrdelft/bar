export default defineNuxtRouteMiddleware((to, from) => {
  if (!(to.path === "/" || to.path.startsWith("/auth"))) {
    const { getToken } = useToken();
    const token = getToken();
    if (!token) {
      navigateTo({ path: "/" });
      return;
    }
  }
});

