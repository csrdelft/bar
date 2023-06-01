const config = useRuntimeConfig();

export default {
  clientId: config.public.authId,
  authorizeUri: `${config.public.remoteUrl}/authorize`,
  tokenUri: `${config.public.remoteUrl}/api/v3/token`,
  redirectUri: `${config.public.origin}/api/auth/callback`,
  scopes: ["BAR:NORMAAL", "BAR:BEHEER", "BAR:TRUST"],
};

