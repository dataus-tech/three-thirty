import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';

const storeData = async (userData: any) => {
  try {
    await AsyncStorage.setItem('userData', userData);
  } catch (error) {
    console.error(error);
  }
};

const handleExpiredToken = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
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
        storeData(newUserData);

        return reponseData.accessToken;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

export default handleExpiredToken;
