type TokenData = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authRequest = auth.handleRequest(event);

  // check if user is authenticated
  const session = await authRequest.validateBearerToken();
  if (!session) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  // Get new access_token
  const data = await fetchToken<TokenData>(oauthConfig.tokenUri, {
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
      client_id: oauthConfig.clientId,
      client_secret: config.authSecret,
      scope: oauthConfig.scopes.join(" "),
    }),
  });

  return data;
});
