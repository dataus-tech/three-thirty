import {useRecoilValue} from 'recoil';
import {userState} from '../recoil/userState';
import {API_URL} from '@env';
import handleExpiredToken from '../utils/handleExpiredToken';

export function useApiRequest() {
  const userData: any = useRecoilValue(userState);

  return async (url: string, method = 'GET', body: any) => {
    const isEditOrDeleteComment =
      url.includes('/comments/') &&
      !url.includes('/comments/create') &&
      (method === 'POST' || method === 'PATCH');

    try {
      const accessToken = userData?.accessToken;
      const options = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: body ? JSON.stringify(body) : null,
      };

      const response = await fetch(`${API_URL}${url}`, options);

      if (response.status === 200) {
        if (isEditOrDeleteComment) {
          return response;
        } else {
          return await response.json();
        }
      }

      if (response.status === 401) {
        // 토큰이 만료된 경우 다시 토큰을 얻는 로직을 수행
        const newAccessToken = await handleExpiredToken(userData);
        if (newAccessToken) {
          options.headers.Authorization = `Bearer ${newAccessToken}`;
          const newResponse = await fetch(`${API_URL}${url}`, options);
          if (newResponse.status === 200) {
            if (isEditOrDeleteComment) {
              return newResponse;
            } else {
              return await newResponse.json();
            }
          }
        }

        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
