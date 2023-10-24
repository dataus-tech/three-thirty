import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {postIdState, updateState} from '../recoil/postState';
import {useRecoilState} from 'recoil';
import Comment from '../components/Comment';
import {API_URL} from '@env';
import handleExpiredToken from '../utils/handleExpiredToken';
import {userState} from '../recoil/userState';

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

interface DetailPostType {
  nick_name: number;
  post_content: string;
  comment_count: number;
  like_count: number;
  hate_count: number;
  like_status: number;
  hate_status: number;
}

const DetailScreen = ({navigation}: any) => {
  const [detailData, setDetailData] = useState<DetailPostType[]>([]);
  const [user] = useRecoilState(userState);
  const [postId] = useRecoilState(postIdState);
  const accessToken = JSON.parse(user!)?.accessToken;

  const getDetailPost = async () => {
    try {
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
      const status = JSON.stringify(response.status);
      if (status === '200') {
        setDetailData(postData);
      }

      if (resCode === '"EXPIRED_TOKEN"') {
        const newAccessToken = await handleExpiredToken(user);
        if (newAccessToken) {
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
    fetch(`${API_URL}/post/like/${postId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(response => {
      if (response.status === 200) {
        setIsUpdated(true);
        setIsUpdated(false);
      }
    });
  };
  const toggleHate = async () => {
    fetch(`${API_URL}/post/hate/${postId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(response => {
      if (response.status === 200) {
        setIsUpdated(true);
        setIsUpdated(false);
      }
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
