import Cookies, { CookieAttributes } from 'js-cookie';
import { Token } from 'client-oauth2';
import csrAuth from '@/auth/csrAuth';
import axios, { AxiosRequestConfig } from 'axios';

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

export const fetchAuthorized = async <T>(requestObj: AxiosRequestConfig & {url: string}):
  Promise<T> => {
  const token = getToken();

  if (!token) {
    throw new Error('Geen token');
  }

  try {
    const response = await axios(token.sign({
      ...requestObj,
      headers: {
        ...requestObj.headers,
        'Content-Type': 'application/json',
      },
      url: process.env.VUE_APP_REMOTE_URL + requestObj.url,
    }));

    return response.data;
  } catch (e) {
    if (e.response) {
      // removeToken();

      // Een 500 of 401
      return e.response.data;
    }

    throw new Error(e.message);
  }
};
