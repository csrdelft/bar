import { createOAuth2AuthorizationUrl } from "@lucia-auth/oauth";
import oauthConfig from "~/server/utils/oauth-config";

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (session) {
    return sendRedirect(event, "/");
  }

  const [url, state] = await createOAuth2AuthorizationUrl(oauthConfig.authorizeUri, {
    clientId: oauthConfig.clientId,
    scope: oauthConfig.scopes,
    redirectUri: oauthConfig.redirectUri,
  });
  url.searchParams.set("remote-login", "true");

  setCookie(event, "csr_oauth_state", state, {
    httpOnly: true,
    secure: !process.dev,
    path: "/",
    maxAge: 60 * 60,
  });

  return sendRedirect(event, url.toString());
});
