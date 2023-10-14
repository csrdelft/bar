import { Session } from "lucia";

export const fetchAuthorized = async <T>(
  session: Session,
  url: string,
  options?: RequestInit
): Promise<T> => {
  const config = useRuntimeConfig();

  if (!session.accessToken) {
    throw new Error("Geen token");
  }

  const tokenHeader: Record<string, string> = session.locatie?.token
    ? { "X-Bar-Token": session.locatie?.token }
    : {};

  const fullUrl = new URL(url, config.public.remoteUrl);
  const response = await fetch(fullUrl, {
    method: "POST",
    ...options,
    headers: {
      ...tokenHeader,
      Authorization: `Bearer ${session.accessToken}`,
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
