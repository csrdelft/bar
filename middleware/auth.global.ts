export default defineNuxtRouteMiddleware(async () => {
  const session = useSession();
  const { data, error } = await useFetch("/api/session");
  if (error.value) throw createError("Failed to fetch data");
  session.value = data.value?.session ?? null;
});
