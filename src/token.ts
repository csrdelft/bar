import Cookies, { CookieAttributes } from 'js-cookie';
import { Token } from 'client-oauth2';
import csrAuth from '@/auth/csrAuth';

const TOKEN_OPTIONS: CookieAttributes = { sameSite: 'strict' };

// Session cookie, browser sluiten verwijderd cookie
export const setToken = (token: Token): void => { Cookies.set('token', JSON.stringify(token.data), TOKEN_OPTIONS); };
export const removeToken = (): void => Cookies.remove('token', TOKEN_OPTIONS);
export const getToken = (): Token|null => {
  const data = Cookies.get('token');

  if (data) {
    return new Token(csrAuth, JSON.parse(data));
  }

  return null;
};
