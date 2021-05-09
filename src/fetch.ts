import axios, { AxiosRequestConfig } from 'axios';
import router from '@/router';
import { getLocatieToken, getToken } from '@/token';

type FetchConfig = AxiosRequestConfig & {url: string}

export const fetchAuthorized = async <T>(requestObj: FetchConfig): Promise<T> => {
  const token = getToken();

  if (!token) {
    console.error('Kan niet!', requestObj);
    await router.push('/auth/logout');

    throw new Error('Geen token');
  }

  try {
    const response = await axios(token.sign({
      ...requestObj,
      headers: {
        ...requestObj.headers,
        'Content-Type': 'application/json',
        'X-Bar-Token': getLocatieToken(),
      },
      url: process.env.VUE_APP_REMOTE_URL + requestObj.url,
    }));

    return response.data;
  } catch (e) {
    if (e.response && e.response.status === 401) {
      await router.push('/auth/logout');

      throw new Error('Niet ingelogd!');
    }
    throw new Error(e.message);
  }
};

export default fetchAuthorized;
