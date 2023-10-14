export default defineNuxtRouteMiddleware(async () => {
  const { data, error } = await useFetch("/api/session");

  if (!data.value?.session?.accessToken) {
    return navigateTo("/");
  } else if (data.value?.session?.expiresAt! < Date.now()) {
    await useFetch("/api/auth/refresh-token", { method: "POST" });
    return;
  }
});
