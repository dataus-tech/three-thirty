import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import {updateState} from '../recoil/postState';
import {useRecoilState} from 'recoil';
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

const CommentBox = ({post}: any) => {
  const [_, setIsUpdated] = useRecoilState(updateState);
  const commentId = post?.comment_id;
  const commentContent = post?.comment_content;

  const deleteComment = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;
    const postId = Number(await AsyncStorage.getItem('post_id'));

    fetch(`${API_URL}/post/${postId}/comments/${commentId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(response => {
      const status = JSON.stringify(response?.status);
      if (status === '200') {
        setIsUpdated(true);
        setIsUpdated(false);
      }
    });
  };

  const [userId, setUserId] = useState();

  useEffect(() => {
    async function fetchData() {
      const userData = await AsyncStorage.getItem('userData');
      setUserId(JSON.parse(userData!)?.user_id);
    }
    fetchData();
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [comment, setComment] = useState(post?.comment_content);

  const editComment = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;
    const postId = Number(await AsyncStorage.getItem('post_id'));

    fetch(`${API_URL}/post/${postId}/comments/${commentId}`, {
      method: 'PATCH',
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
    }).then(response => {
      const status = JSON.stringify(response?.status);

      if (status === '200') {
        setIsUpdated(true);
        setIsUpdated(false);
        setIsEditMode(false);
      }
    });
  };

  const cancelCommentEdit = () => {
    setIsEditMode(false);
    setComment(commentContent);
  };

  return (
    <View style={styles.cmtBox}>
      <View>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            onChangeText={setComment}
            value={comment}
            placeholder="댓글을 입력해주세요"
            placeholderTextColor={'black'}
          />
        ) : (
          <Text key={commentId} style={styles.comment}>
            {commentContent}
          </Text>
        )}
      </View>
      {post?.user_id === userId && (
        <View>
          {isEditMode ? (
            <TouchableOpacity onPress={cancelCommentEdit}>
              <View>
                <Text>취소</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={deleteComment}>
              <View>
                <Text>삭제</Text>
              </View>
            </TouchableOpacity>
          )}
          {isEditMode ? (
            <TouchableOpacity onPress={editComment}>
              <View>
                <Text>수정</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditMode(true)}>
              <View>
                <Text>수정</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default CommentBox;
