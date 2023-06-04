import oauthConfig from "~/util/oauth-config";
import { fetchToken } from "~/composables/fetch";
import { Token } from "~/types/token";
import { tokenOptions } from "~/util/token-options";

type TokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const tokenString = getCookie(event, "token");
  const token = JSON.parse(tokenString ?? "");

  // Get new access_token
  const data = await fetchToken<TokenData>(oauthConfig.tokenUri, {
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
      client_id: oauthConfig.clientId,
      client_secret: config.authSecret,
      scope: oauthConfig.scopes.join(" "),
    }),
  });

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  } satisfies Token;
});

