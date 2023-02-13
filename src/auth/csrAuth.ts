import ClientOAuth2 from "client-oauth2";

// FIXME: redirectUri is 'http://localhost:3000/auth/callback'
const csrAuth = new ClientOAuth2({
  clientId: process.env.VUE_APP_OAUTH2_CLIENT_ID,
  authorizationUri: `${process.env.VUE_APP_REMOTE_URL}/authorize`,
  accessTokenUri: `${process.env.VUE_APP_REMOTE_URL}/api/v3/token`,
  redirectUri: `${window.location.origin}/auth/callback`,
  scopes: ["BAR:NORMAAL", "BAR:BEHEER", "BAR:TRUST"],
});

export default csrAuth;

