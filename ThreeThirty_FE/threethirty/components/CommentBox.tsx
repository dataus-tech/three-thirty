import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import {postIdState, updateState} from '../recoil/postState';
import {useRecoilState, useRecoilValue} from 'recoil';
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

const CommentBox = ({post}: any) => {
  const [_, setIsUpdated] = useRecoilState(updateState);
  const commentId = post?.comment_id;
  const commentContent = post?.comment_content;
  const postId = useRecoilValue(postIdState);

  const apiRequest = useApiRequest();

  const deleteComment = async () => {
    try {
      const res = await apiRequest(
        `/post/${postId}/comments/${commentId}`,
        'POST',
        null,
      );
      if (res.status === 200) {
        setIsUpdated(true);
        setIsUpdated(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [userId, setUserId] = useState();

  const user = useRecoilValue(userState);

  useEffect(() => {
    async function fetchData() {
      setUserId(JSON.parse(user!)?.user_id);
    }
    fetchData();
  }, [user]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [comment, setComment] = useState(post?.comment_content);

  const editComment = async () => {
    try {
      const res = await apiRequest(
        `/post/${postId}/comments/${commentId}`,
        'PATCH',
        {
          comment_content: comment,
          user_id: userId,
          post_id: postId,
        },
      );

      if (res.status === 200) {
        setIsUpdated(true);
        setIsUpdated(false);
        setIsEditMode(false);
      }
    } catch (error) {
      console.error(error);
    }
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
