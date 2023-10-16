import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateState} from '../recoil/postState';
import {useRecoilState} from 'recoil';
import Comment from '../components/Comment';
import {API_URL} from '@env';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  contentBox: {
    flexDirection: 'row',
    width: screenWidth,
    marginLeft: 50,
  },
  avatarBox: {
    width: 40,
    height: 40,
    backgroundColor: 'lightgray',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userName: {
    textAlign: 'left',
  },
  bottomBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  bottomSubBox: {
    width: 100,
    paddingTop: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  num: {
    marginLeft: 4,
  },
});

const DetailScreen = ({navigation}) => {
  const [detailData, setDetailData] = useState({});

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('userData', userData);
    } catch (error) {
      console.error(error);
    }
  };

  const getDetailPost = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const postId = Number(await AsyncStorage.getItem('post_id'));
      const accessToken = JSON.parse(userData!)?.accessToken;
      const refreshToken = JSON.parse(userData!)?.refreshToken;

      const response = await fetch(`${API_URL}/post/${postId}`, {
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

            const res = await fetch(`${API_URL}/post/${postId}`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            const newPostData = await res.json();
            setDetailData(newPostData);
          }
        }
      } else {
        setDetailData(postData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isUpdated, setIsUpdated] = useRecoilState(updateState);

  useEffect(() => {
    getDetailPost();
    const unsubscribe = navigation.addListener('focus', () => {
      getDetailPost();
    });
    return unsubscribe;
  }, [navigation, isUpdated]);

  const nick_name = detailData[0]?.nick_name;
  const post_content = detailData[0]?.post_content;
  const comment_count = detailData[0]?.comment_count;
  const like_count = detailData[0]?.like_count;
  const hate_count = detailData[0]?.hate_count;
  const like_status = detailData[0]?.like_status;
  const hate_status = detailData[0]?.hate_status;

  const toggleLike = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;
    const postId = Number(await AsyncStorage.getItem('post_id'));

    fetch(`${API_URL}/post/like/${postId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(response => {
      // const status = JSON.stringify(response?.status);
      setIsUpdated(true);
      setIsUpdated(false);
      // if (status === '401') {
      //   Alert.alert('토큰 만료');
      // }
    });
  };
  const toggleHate = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;
    const postId = Number(await AsyncStorage.getItem('post_id'));

    fetch(`${API_URL}/post/hate/${postId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(response => {
      // const status = JSON.stringify(response?.status);
      setIsUpdated(true);
      setIsUpdated(false);
      // if (status === '401') {
      //   Alert.alert('토큰 만료');
      // }
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <View style={styles.avatarBox}>
            <Icon name="person" size={30} color="gray" />
          </View>
          <View>
            <Text style={styles.userName}>{nick_name}</Text>
            <Text>{post_content}</Text>
            <View style={styles.bottomBox}>
              <View style={styles.bottomSubBox}>
                <Icon name="comment" size={30} />
                <Text style={styles.num}>{comment_count}</Text>
              </View>
              <View style={styles.bottomSubBox}>
                <TouchableOpacity onPress={() => toggleLike()}>
                  <Icon
                    name="thumb-up"
                    size={30}
                    color={like_status ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
                <Text style={styles.num}>{like_count}</Text>
              </View>
              <View style={styles.bottomSubBox}>
                <TouchableOpacity onPress={() => toggleHate()}>
                  <Icon
                    name="thumb-down"
                    size={30}
                    color={hate_status ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
                <Text style={styles.num}>{hate_count}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Comment navigation={navigation} />
    </>
  );
};

export default DetailScreen;
