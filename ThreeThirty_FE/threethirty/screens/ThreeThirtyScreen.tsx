import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import PostWrite from '../components/PostWrite';
import ThreeThirtyPost from '../components/ThreeThirtyPost';
import {updateState} from '../recoil/postState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00b0f0',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

const ThreeThirtyPostData = [
  {id: 1, content: '너무했어, 삼전', time: '3:31pm'},
  {id: 2, content: '너무했어, 삼전!', time: '3:32pm'},
  {id: 3, content: '너무했어, 삼전!!', time: '3:33pm'},
  {id: 4, content: '너무했어, 삼전!!!', time: '3:34pm'},
  {id: 5, content: '너무했어, 삼전!!!!', time: '3:35pm'},
  {id: 6, content: '너무했어, 삼전!!!!!', time: '3:36pm'},
  {id: 7, content: '너무했어, 삼전!!!!', time: '3:35pm'},
  {id: 8, content: '너무했어, 삼전!!!!!', time: '3:36pm'},
  {id: 9, content: '너무했어, 삼전!!!!', time: '3:37pm'},
  {id: 10, content: '너무했어, 삼전!!!!!', time: '3:38pm'},
  {id: 11, content: '너무했어, 삼전!!!!', time: '3:40pm'},
  {id: 12, content: '너무했어, 삼전!!!!!!!!', time: '3:36pm'},
];

interface PostType {
  post_id: number;
  nick_name: string;
  image_url: string;
  post_content: string;
  update_date: null | string;
  like_count: number;
  hate_count: number;
  comment_count: number;
  company_title: string;
  hashtag_content: string[];
  attach_file_url: string[];
  like_status: number;
  hate_status: number;
}

const ThreeThirtyScreen = () => {
  const [data, setData] = useState<PostType[]>([]);
  const [isWriteMode, setIsWriteMode] = useState(false);

  const handleFloatingButtonPress = () => {
    setIsWriteMode(true);
  };
  const navigation = useNavigation();

  const [isUpdated, _] = useRecoilState(updateState);

  const handleGoToDetail = (post_id: number) => {
    navigation.navigate('Detail', {post_id});
  };

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('userData', userData);
    } catch (error) {
      console.error(error);
    }
  };

  const getPost = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const accessToken = JSON.parse(userData!)?.accessToken;
      const refreshToken = JSON.parse(userData!)?.refreshToken;

      const response = await fetch(`${API_URL}/post/threethirty`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const postData = await response.json();
      const resCode = JSON.stringify(postData.code);
      if (resCode === '"EXPIRED_TOKEN"') {
        if (refreshToken) {
          const resp = await fetch(`${API_URL}/users/refreshToken`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          const status = JSON.stringify(resp.status);

          if (status === '200') {
            const reponseData = await resp.json();
            const newUserData = JSON.stringify(reponseData);
            storeData(newUserData);

            const newAccessToken = reponseData.accessToken;

            const res = await fetch(`${API_URL}/post/threethirty`, {
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
      } else {
        setData(postData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPost();
  }, [isWriteMode, isUpdated]);
  return (
    <>
      {isWriteMode ? (
        <PostWrite
          isThreeThirty={true}
          isWriteMode={isWriteMode}
          setIsWriteMode={setIsWriteMode}
        />
      ) : (
        <View style={styles.container}>
          <ScrollView>
            {data.map(post => (
              <ThreeThirtyPost
                key={post.id}
                data={post}
                handleGoToDetail={handleGoToDetail}
                setIsWriteMode={setIsWriteMode}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleFloatingButtonPress}>
            <Icon name="create" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ThreeThirtyScreen;
