import Cookies, { CookieAttributes } from 'js-cookie';
import { Data, Token } from 'client-oauth2';
import csrAuth from '@/auth/csrAuth';
import { BarLocatie } from '@/model';

const TOKEN_OPTIONS: CookieAttributes = { sameSite: 'strict' };

// Session cookie, browser sluiten verwijderd cookie
export const setToken = (data: Data): void => {
  Cookies.set('token', JSON.stringify(data), TOKEN_OPTIONS);
};
export const removeToken = (): void => Cookies.remove('token', TOKEN_OPTIONS);
export const getTokenData = (): Data | null => {
  const data = Cookies.get('token');

  if (data) {
    return JSON.parse(data);
  }

  return null;
};
/**
 * Haal de oauth2 token op uit de cookie.
 * Gebruik het veld in de vuex store als je wil dat de frontend veranderd als de token verandert.
 */
export const getToken = (): Token | null => {
  const data = getTokenData();

  if (data) {
    return new Token(csrAuth, data);
  }

  return null;
};

export const createToken = (d: Data | null): Token | null => {
  if (d == null) {
    return null;
  }

  return new Token(csrAuth, d);
};

const LOCATIE_TOKEN_OPTIONS: CookieAttributes = {
  sameSite: 'strict',
  expires: new Date(+new Date() + 1000 * 24 * 60 * 60 * 1000),
};

export const setLocatieToken = (locatieToken: BarLocatie): void => {
  Cookies.set('locatie-token', JSON.stringify(locatieToken), LOCATIE_TOKEN_OPTIONS);
};

export const removeLocatieToken = (): void => {
  Cookies.remove('locatie-token', LOCATIE_TOKEN_OPTIONS);
};

export const getLocatieToken = (): BarLocatie | null => {
  const locatie = Cookies.get('locatie-token');
  if (!locatie) {
    return null;
  }
  return JSON.parse(locatie);
};
