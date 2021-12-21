import router from '@/router';
import {getLocatieToken, getToken} from '@/token';
import {RequestObject} from "client-oauth2";

type RequestObj = RequestObject & { headers: Record<string, string> }

export const fetchAuthorized = async <U, T extends RequestObj = any>(requestObj: T): Promise<U> => {
  const token = getToken();

  if (!token) {
    await router.push('/auth/logout');

    throw new Error('Geen token');
  }

  const locatieToken = getLocatieToken()

  const tokenHeader: Record<string, string> = locatieToken ? {'X-Bar-Token': locatieToken.sleutel} : {}

  try {
    const {url, ...rest} = token.sign({
      ...requestObj,
      headers: {
        ...requestObj.headers,
        ...tokenHeader,
        'Content-Type': 'application/json',
      },
      url: process.env.VUE_APP_REMOTE_URL + requestObj.url,
    });

    const response = await fetch(url, rest);

    return await response.json() as U;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      await router.push('/auth/logout');

      throw new Error('Niet ingelogd!');
    }
    throw new Error(e.message);
  }
};

export default fetchAuthorized;
