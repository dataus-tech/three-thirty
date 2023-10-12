import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import HomePost from '../components/HomePost';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PostWrite from '../components/PostWrite';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateState} from '../recoil/postState';
import {useRecoilState} from 'recoil';

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
});

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

const HomeScreen = () => {
  const [data, setData] = useState<PostType[]>([]);
  const [isWriteMode, setIsWriteMode] = useState(false);
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

      const response = await fetch('http://localhost:8080/post/general', {
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
          const resp = await fetch('http://localhost:8080/users/refreshToken', {
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

            const res = await fetch('http://localhost:8080/post/general', {
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

  const handleFloatingButtonPress = () => {
    setIsWriteMode(true);
  };

  return (
    <>
      {isWriteMode ? (
        <PostWrite isWriteMode={isWriteMode} setIsWriteMode={setIsWriteMode} />
      ) : (
        <View style={styles.container}>
          <ScrollView>
            {data?.map(post => (
              <HomePost
                key={post.post_id}
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

export default HomeScreen;
