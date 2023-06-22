import { defineStore } from "pinia";
import { LocatieToken, Token } from "~/types/token";
import oauthConfig from "~/util/oauth-config";
import { locatieTokenOptions, tokenOptions } from "~/util/token-options";

export const useAuthStore = defineStore("auth", () => {
  // MARK: State
  const token = useCookie<Token | null>("token", tokenOptions);
  const locatieToken = useCookie<LocatieToken | null>("locatie-token", locatieTokenOptions);

  // MARK: Getters

  // MARK: Actions/Mutations
  const authorize = () => {
    /**
     * Open autorisatie in dit venster
     * Ga direct terug naar / als er al een profiel is.
     */
    const params = new URLSearchParams({
      client_id: oauthConfig.clientId,
      scope: oauthConfig.scopes.join(" "),
      response_type: "code",
      redirect_uri: oauthConfig.redirectUri,
      // TODO: state: "YXJTtIeiEVBJfDehaIx4cu1S2xnufTJwi0k8Lg_6r3o",

      "remote-login": "true",
    });
    const url = new URL(oauthConfig.authorizeUri + "?" + params);
    // FIXME: window.open(url, "_self");
    window.open(url);
  };
  const refreshToken = async () => {
    const data = await $fetch("/api/auth/refresh-token");
    token.value = data;
  };
  const signOut = async () => {
    token.value = null;
    locatieToken.value = null;
  };
  async function vertrouwLocatie(naam: string) {
    const barLocatie = await fetchAuthorized<LocatieToken>("/api/v3/bar/trust", {
      body: JSON.stringify({ naam }),
    });

    locatieToken.value = barLocatie;
  }

  return {
    token,
    locatieToken,
    authorize,
    refreshToken,
    signOut,
    vertrouwLocatie,
  };
});

