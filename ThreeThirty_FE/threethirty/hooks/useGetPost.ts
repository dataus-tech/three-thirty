import {PostType} from './../types/types';
import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {updateState} from '../recoil/postState';
import {useApiRequest} from '../apis/api';

const useGetPost = (
  postType: string | undefined,
  isWriteMode?: any,
  navigation?: any,
) => {
  const apiRequest = useApiRequest();
  const [data, setData] = useState<PostType[]>([]);
  const [isUpdated, _] = useRecoilState(updateState);

  const url = `/post/${postType}`;

  const getPost = async () => {
    try {
      const response = await apiRequest(url, 'GET', null);
      setData(response);
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
