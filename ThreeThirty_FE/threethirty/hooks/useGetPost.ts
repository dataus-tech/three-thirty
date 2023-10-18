import {PostType} from './../types/types';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {updateState} from '../recoil/postState';
import handleExpiredToken from '../utils/handleExpiredToken';

const useGetPost = (
  postType: string | undefined,
  isWriteMode?: any,
  navigation?: any,
) => {
  const [data, setData] = useState<PostType[]>([]);
  const [isUpdated, _] = useRecoilState(updateState);

  const url = `${API_URL}/post/${postType}`;

  const getPost = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const accessToken = JSON.parse(userData!)?.accessToken;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const postData = await response.json();
      const resCode = JSON.stringify(postData?.code);

      const status = JSON.stringify(response.status);

      if (status === '500') {
        console.error('서버 에러');
        return;
      }

      if (status === '200') {
        setData(postData);
      }

      if (resCode === '"EXPIRED_TOKEN"') {
        const newAccessToken = await handleExpiredToken();
        if (newAccessToken) {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          const newPostData = await res.json();
          setData(newPostData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPost();
    const unsubscribe = navigation?.addListener('focus', () => {
      getPost();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWriteMode, isUpdated, navigation]);

  return data;
};

export default useGetPost;
