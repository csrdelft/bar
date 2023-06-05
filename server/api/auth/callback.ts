import oauthConfig from "~/util/oauth-config";
import { fetchToken } from "~/composables/fetch";
import { Token } from "~/types/token";
import { tokenOptions } from "~/util/token-options";

const urldecode = (string: string) => decodeURIComponent(string.replace(/\+/g, " "));

type TokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const query = getQuery(event);

  // Get access_token en refresh_token
  const data = await fetchToken<TokenData>(oauthConfig.tokenUri, {
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: oauthConfig.clientId,
      client_secret: config.authSecret,
      redirect_uri: oauthConfig.redirectUri,
      code: urldecode(query["code"] as string),
    }),
  });

  setCookie(
    event,
    "token",
    JSON.stringify({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    } satisfies Token),
    tokenOptions
  );
  // setCookie(
  //   event,
  //   "locatie-token",
  //   JSON.stringify({
  //     accessToken: data.access_token,
  //     refreshToken: data.refresh_token,
  //     expiresIn: data.expires_in,
  //   } satisfies Token),
  //   locatieTokenOptions
  // );

  return sendRedirect(event, "/");
});

