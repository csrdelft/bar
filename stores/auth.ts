import { defineStore } from "pinia";
import { LocatieToken, Token } from "~/types/token";
import oauthConfig from "~/util/oauth-config";
// import { Data as OAuth2Data } from "client-oauth2";
// import { BarLocatie } from "~/types/barLocatie";
// import { Profiel } from "~/types/profiel";
// import fetchAuthorized from "~/util/fetch";
// import { useToken } from "~/composables/useToken";

export const useAuthStore = defineStore("auth", () => {
  // MARK: State
  // const token = useCookie<Token | null>("token", { sameSite: "strict" });
  // const locatieToken = useCookie<LocatieToken | null>("locatie-token", {
  //   sameSite: "strict",
  //   expires: new Date(+new Date() + 1000 * 24 * 60 * 60 * 1000),
  // });

  // MARK: Getters

  // MARK: Actions/Mutations
  const authorize = () => {
    /**
     * Open autorisatie in dit venster
     * Ga direct terug naar / als er al een profiel is.
     */
    const params = new URLSearchParams({
      client_id: oauthConfig.clientId,
      //   scope:'STANDAARD',
      scope: oauthConfig.scopes.join(" "),
      response_type: "code",
      redirect_uri: oauthConfig.redirectUri,
      // TODO: state: "YXJTtIeiEVBJfDehaIx4cu1S2xnufTJwi0k8Lg_6r3o",

      "remote-login": "true",
    });
    const url = new URL(oauthConfig.authorizeUri + "?" + params);
    window.open(url, "_self");
  };
  // const refreshToken = async () => {
  //   const data = await fetchAuthorized<Token>(oauthConfig.tokenUri, {
  //     body: JSON.stringify({
  //       grant_type: "refresh_token",
  //       refresh_token: token.value?.refreshToken!,
  //       client_id: oauthConfig.clientId,
  //       client_secret: config.authSecret,
  //       scope: oauthConfig.scopes.join(" "),
  //     }),
  //   });
  //   console.log("🚀 ------------------------------🚀");
  //   console.log("🚀 ~ refreshToken ~ data:", data);
  //   console.log("🚀 ------------------------------🚀");
  // };
  const signOut = async () => {
    const { remove } = await useSession();
    await remove();
  };

  return {
    authorize,
    signOut,
  };
});

