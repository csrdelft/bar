import ClientOAuth2 from "client-oauth2";

export const useCsrAuth = () => {
  const config = useRuntimeConfig();

  const oauthClient = new ClientOAuth2({
    clientId: config.public.oauth2ClientId,
    authorizationUri: `${config.public.remoteUrl}/authorize`,
    accessTokenUri: `${config.public.remoteUrl}/api/v3/token`,
    redirectUri: `${window.location.origin}/auth/callback`,
    scopes: ["BAR:NORMAAL", "BAR:BEHEER", "BAR:TRUST"],
  });

  return { oauthClient };
};

