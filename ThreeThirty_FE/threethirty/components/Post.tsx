import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {postIdState, updateState} from '../recoil/postState';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {API_URL} from '@env';
import {PostType} from '../types/types';
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
  deleteEditBox: {
    position: 'absolute',
    backgroundColor: 'lightgray',
    right: 20,
    top: 20,
    borderWidth: 1,
    zIndex: 100,
  },
  delete: {
    borderBottomWidth: 1,
    padding: 4,
  },
  edit: {
    padding: 4,
  },
});

interface PostProps {
  data: PostType;
  handleGoToDetail: (post_id: number) => void;
  setIsWriteMode: any;
}

const Post = (props: PostProps) => {
  const [userId, setUserId] = useState('');
  const [_, setIsUpdated] = useRecoilState(updateState);

  const {
    post_id,
    nick_name,
    user_id,
    post_content,
    comment_count,
    like_count,
    hate_count,
    like_status,
    hate_status,
  } = props.data;

  const {handleGoToDetail, setIsWriteMode} = props;

  const user: any = useRecoilValue(userState);
  const accessToken = JSON.parse(user!)?.accessToken;

  const toggleLike = async () => {
    fetch(`${API_URL}/post/like/${post_id}`, {
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
    fetch(`${API_URL}/post/hate/${post_id}`, {
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

  useEffect(() => {
    async function fetchData() {
      setUserId(JSON.parse(user!)?.user_id);
    }
    fetchData();
  }, [user]);

  const isPostWriter = user_id === Number(userId);

  const deletePost = async () => {
    fetch(`${API_URL}/post/${post_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(res => {
      const status = JSON.stringify(res.status);
      if (status === '200') {
        setIsUpdated(true);
        setIsUpdated(false);
      }
    });
  };

  const setPostId = useSetRecoilState(postIdState);

  return (
    <TouchableOpacity
      onPress={async () => {
        setPostId(post_id);
        handleGoToDetail(post_id);
      }}>
      {isPostWriter && (
        <View style={styles.deleteEditBox}>
          <TouchableOpacity style={styles.delete} onPress={() => deletePost()}>
            <Text>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.edit}
            onPress={() => setIsWriteMode({edit: true, post: props.data})}>
            <Text>수정</Text>
          </TouchableOpacity>
        </View>
      )}

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
    </TouchableOpacity>
  );
};

export default Post;
