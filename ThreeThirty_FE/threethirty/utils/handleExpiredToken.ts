import {API_URL} from '@env';
import {useSetRecoilState} from 'recoil';
import {userState} from '../recoil/userState';

const useStoreData = async (userData: any) => {
  const setUserState = useSetRecoilState(userState);

  try {
    setUserState(userData);
  } catch (error) {
    console.error(error);
  }
};

const handleExpiredToken = async (userData: any) => {
  try {
    const refreshToken = JSON.parse(userData!)?.refreshToken;

    if (refreshToken) {
      const resp = await fetch(`${API_URL}/users/refreshToken`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (resp.status === 200) {
        const reponseData = await resp.json();
        const newUserData = JSON.stringify(reponseData);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStoreData(newUserData);

        return reponseData.accessToken;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

export default handleExpiredToken;
