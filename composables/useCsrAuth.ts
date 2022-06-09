import ClientOAuth2 from "client-oauth2";

export const useCsrAuth = () =>
  new ClientOAuth2({
    clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID,
    authorizationUri: `${import.meta.env.VITE_REMOTE_URL}/authorize`,
    accessTokenUri: `${import.meta.env.VITE_REMOTE_URL}/api/v3/token`,
    redirectUri: `${window.location.origin}/auth/callback`,
    scopes: ["BAR:NORMAAL", "BAR:BEHEER", "BAR:TRUST"],
  });

