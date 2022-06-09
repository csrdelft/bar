import { Data, Token } from "client-oauth2";
import { useCsrAuth } from "./useCsrAuth";
import { useUserStore } from "../stores/user";
import { CookieOptions } from "nuxt/dist/app/composables";
import { BarLocatie } from "~~/types/barlocatie";

const TOKEN_OPTIONS: CookieOptions = { sameSite: "strict" };
const LOCATIE_TOKEN_OPTIONS: CookieOptions = {
  sameSite: "strict",
  expires: new Date(+new Date() + 1000 * 24 * 60 * 60 * 1000),
};

const token = useCookie("token", TOKEN_OPTIONS);
const locatieToken = useCookie("locatie-token", LOCATIE_TOKEN_OPTIONS);

export const useToken = () => {
  const csrAuth = useCsrAuth();

  // Session cookie, browser sluiten verwijderd cookie
  const setToken = (data: Data): void => {
    token.value = data;
  };
  const removeToken = (): void => {
    token.value = undefined;
  };
  const getTokenData = (): Data | null => {
    return token.value;
  };
  /**
   * Haal de oauth2 token op uit de cookie.
   * Gebruik het veld in de vuex store als je wil dat de frontend veranderd als de token verandert.
   */
  const getToken = (): Token | null => {
    const data = getTokenData();

    if (data) {
      return new Token(csrAuth, data);
    }

    return null;
  };

  const createToken = (d: Data | null): Token | null => {
    if (d == null) {
      return null;
    }

    return new Token(csrAuth, d);
  };

  const setLocatieToken = (locatie: BarLocatie): void => {
    locatieToken.value = locatie;
  };
  const removeLocatieToken = (): void => {
    locatieToken.value = undefined;
  };

  const getLocatieToken = (): BarLocatie | null => {
    const locatie = locatieToken.value;
    if (!locatie) {
      return null;
    }
    return JSON.parse(locatie);
  };

  const setupToken = () => {
    const user = useUserStore();

    const token = getTokenData();
    if (token) {
      user.setToken(token);
    }

    const locatieToken = getLocatieToken();
    if (locatieToken) {
      user.setLocatieToken(locatieToken);
    }
  };

  return {
    setToken,
    removeToken,
    getTokenData,
    getToken,
    createToken,
    setLocatieToken,
    removeLocatieToken,
    getLocatieToken,
    setupToken,
  };
};

