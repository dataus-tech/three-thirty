import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {updateState} from '../recoil/postState';
import {useRecoilState} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native';
import CommentBox from './CommentBox';
import {API_URL} from '@env';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  commentBox: {
    flexDirection: 'row',
  },
  input: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.05,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 30,
    backgroundColor: 'gray',
  },
  comments: {
    width: screenWidth * 0.9,
    justifyContent: 'flex-start',
  },
  comment: {
    marginVertical: 10,
  },
  cmtBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const Comment = ({navigation}: any) => {
  const [isUpdated, setIsUpdated] = useRecoilState(updateState);
  const [data, setData] = useState([]);

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('userData', userData);
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const postId = Number(await AsyncStorage.getItem('post_id'));
      const accessToken = JSON.parse(userData!)?.accessToken;
      const refreshToken = JSON.parse(userData!)?.refreshToken;

      const response = await fetch(`${API_URL}/post/${postId}/comments`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const commentData = await response.json();
      const resCode = JSON.stringify(commentData.code);
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

            const res = await fetch(`${API_URL}/post/${postId}/comments`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            const newCommentData = await res.json();
            setData(newCommentData);
          }
        }
      } else {
        setData(commentData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getComments();
    const unsubscribe = navigation.addListener('focus', () => {
      getComments();
    });
    return unsubscribe;
  }, [navigation, isUpdated]);

  const [comment, setComment] = useState('');

  const postComment = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;
    const postId = Number(await AsyncStorage.getItem('post_id'));
    const userId = JSON.parse(userData!)?.user_id;

    fetch(`${API_URL}/post/${postId}/comments/create`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        comment_content: comment,
        user_id: userId,
        post_id: postId,
      }),
    }).then(() => {
      // const status = JSON.stringify(response?.status);
      setIsUpdated(true);
      setIsUpdated(false);
      setComment('');
      // if (status === '401') {
      //   Alert.alert('토큰 만료');
      // }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentBox}>
        <TextInput
          style={styles.input}
          onChangeText={setComment}
          value={comment}
          placeholder="댓글을 입력해주세요"
          placeholderTextColor={'black'}
        />
        <TouchableOpacity onPress={postComment}>
          <View style={styles.btn}>
            <Text>작성</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.comments}>
          {data?.map(post => (
            <CommentBox key={post?.comment_id} post={post} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Comment;
