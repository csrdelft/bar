import Cookies, { CookieAttributes } from 'js-cookie';
import { Data, Token } from 'client-oauth2';
import csrAuth from '@/auth/csrAuth';

const TOKEN_OPTIONS: CookieAttributes = { sameSite: 'strict' };

// Session cookie, browser sluiten verwijderd cookie
export const setToken = (data: Data): void => { Cookies.set('token', JSON.stringify(data), TOKEN_OPTIONS); };
export const removeToken = (): void => Cookies.remove('token', TOKEN_OPTIONS);
export const getTokenData = (): Data|null => {
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
export const getToken = (): Token|null => {
  const data = getTokenData();

  if (data) {
    return new Token(csrAuth, data);
  }

  return null;
};

export const createToken = (d: Data|null): Token|null => (d != null ? new Token(csrAuth, d) : null);
