import oauthConfig from "~/util/oauth-config";
import { fetchToken } from "~/composables/fetch";

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

  event.context.session.access_token = data.access_token;
  event.context.session.refresh_token = data.refresh_token;

  return sendRedirect(event, "/");
});

