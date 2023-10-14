import { OAuthRequestError } from "@lucia-auth/oauth";
import oauthConfig from "~/server/utils/oauth-config";
import { Profiel } from "~/types/profiel";

type TokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

const fetchToken = async (authorizationCode: string): Promise<TokenData> => {
  const config = useRuntimeConfig();

  const body = JSON.stringify({
    grant_type: "authorization_code",
    client_id: oauthConfig.clientId,
    client_secret: config.authSecret,
    redirect_uri: oauthConfig.redirectUri,
    code: authorizationCode,
  });
  const response = await fetch(oauthConfig.tokenUri, {
    method: "POST",
    body,
    headers: {
      "User-Agent": "lucia",
      "Content-Type": "application/json",
    },
  });

  if (response.status == 401) {
    throw new Error("Niet ingelogd!");
  }
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as TokenData;
};

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (session) {
    return sendRedirect(event, "/");
  }

  const storedState = getCookie(event, "csr_oauth_state");
  const query = getQuery(event);
  const state = query.state?.toString();
  const code = query.code?.toString();

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return sendError(
      event,
      createError({
        statusCode: 400,
      })
    );
  }

  try {
    const token = await fetchToken(code);

    const getUser = async () => {
      const response = await $fetch<Profiel>(oauthConfig.profileUri, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      });

      const user = await auth.createUser({
        userId: response.id,
        key: null,
        attributes: {
          name: response.displayName,
          scopes: JSON.stringify(response.scopes),
          slug: response.slug,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_in: token.expires_in,
      },
    });
    authRequest.setSession(session);
    return sendRedirect(event, "/");
  } catch (e) {
    console.error(e);

    if (e instanceof OAuthRequestError) {
      // invalid code
      return sendError(
        event,
        createError({
          statusCode: 400,
        })
      );
    }
    return sendError(
      event,
      createError({
        statusCode: 500,
      })
    );
  }
});
