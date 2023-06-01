import { useAuthStore } from "~/stores/auth";

export const fetchAuthorized = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const config = useRuntimeConfig();
  const { session } = await useSession();

  if (!session.value?.access_token) {
    throw new Error("Geen token");
  }

  // FIXME:
  // const tokenHeader: Record<string, string> = authStore.locatieToken?.sleutel
  //   ? { "X-Bar-Token": authStore.locatieToken.sleutel }
  //   : {};

  const fullUrl = new URL(url, config.public.remoteUrl);
  const response = await fetch(fullUrl, {
    method: "POST",
    ...options,
    headers: {
      // FIXME: ...tokenHeader,
      Authorization: `Bearer ${session.value?.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status == 401) {
    throw new Error("Niet ingelogd!");
  }
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as T;
};

export const fetchToken = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const config = useRuntimeConfig();

  const fullUrl = new URL(url, config.public.remoteUrl);
  const response = await fetch(fullUrl, {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 401) {
    throw new Error("Niet ingelogd!");
  }
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as T;
};

