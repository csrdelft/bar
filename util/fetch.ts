// import { getLocatieToken, getToken } from "@/util/token";
import { RequestObject } from "client-oauth2";
import { useToken } from "~/composables/useToken";
import { useTypedRouter } from "~/generated";

type RequestObj = RequestObject & { headers?: Record<string, string> };

export const fetchAuthorized = async <
  U,
  T extends RequestObj = RequestInit & { url: string; headers?: Record<string, string> }
>(
  requestObj: T
): Promise<U> => {
  const { getLocatieToken, getToken } = useToken();
  const token = getToken();

  if (!token) {
    const { router, routes } = useTypedRouter();
    await router.push({ name: routes.authLogout });

    throw new Error("Geen token");
  }

  const locatieToken = getLocatieToken();

  const tokenHeader: Record<string, string> = locatieToken ? { "X-Bar-Token": locatieToken.sleutel } : {};

  const { url, ...rest } = token.sign({
    ...requestObj,
    headers: {
      ...requestObj.headers,
      ...tokenHeader,
      "Content-Type": "application/json",
    },
    url: process.env.VUE_APP_REMOTE_URL + requestObj.url,
  });

  const response = await fetch(url, rest);

  if (response.status == 401) {
    const { router, routes } = useTypedRouter();
    await router.push({ name: routes.authLogout });

    throw new Error("Niet ingelogd!");
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as U;
};

export default fetchAuthorized;

