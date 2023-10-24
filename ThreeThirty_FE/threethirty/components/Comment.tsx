import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {postIdState, updateState} from '../recoil/postState';
import {useRecoilState, useRecoilValue} from 'recoil';
import {TouchableOpacity} from 'react-native';
import CommentBox from './CommentBox';
import {useApiRequest} from '../apis/api';
import {userState} from '../recoil/userState';

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

interface CommentType {
  comment_id: number;
  post_id: number;
  user_id: number;
  comment_content: number;
}

const Comment = ({navigation}: any) => {
  const [isUpdated, setIsUpdated] = useRecoilState(updateState);
  const [data, setData] = useState<CommentType[]>([]);
  const postId = useRecoilValue(postIdState);
  const user = useRecoilValue(userState);

  const apiRequest = useApiRequest();

  const getComments = async () => {
    try {
      const commentData = await apiRequest(
        `/post/${postId}/comments`,
        'GET',
        null,
      );

      if (commentData) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isUpdated]);

  const [comment, setComment] = useState('');

  const postComment = async () => {
    const userId = JSON.parse(user!)?.user_id;

    try {
      const response = await apiRequest(
        `/post/${postId}/comments/create`,
        'POST',
        {
          comment_content: comment,
          user_id: userId,
          post_id: postId,
        },
      );

      if (response) {
        setIsUpdated(true);
        setIsUpdated(false);
        setComment('');
      }
    } catch (error) {
      console.error(error);
    }
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
          {data?.map(post => {
            const commentId = post?.comment_id;
            return <CommentBox key={commentId} post={post} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Comment;
