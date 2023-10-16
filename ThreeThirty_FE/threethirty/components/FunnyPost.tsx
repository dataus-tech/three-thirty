// import React from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     paddingHorizontal: 30,
//     paddingVertical: 30,
//     borderBottomWidth: 1,
//   },
//   contentBox: {
//     flexDirection: 'row',
//   },
//   rank: {
//     fontSize: 30,
//     marginRight: 10,
//   },
//   bottomBox: {
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   bottomSubBox: {
//     width: 100,
//     paddingTop: 30,
//     flex: 1,
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   num: {
//     marginLeft: 4,
//   },
// });

// interface FunnyPostProps {
//   data: {
//     id: number;
//     rank: number;
//     content: string;
//     commentCount: number;
//     likeCount: number;
//     disLikeCount: number;
//   };
// }

// const FunnyPost = (props: FunnyPostProps) => {
//   const {rank, content, commentCount, likeCount, disLikeCount} = props.data;
//   return (
//     <View style={styles.container}>
//       <View style={styles.contentBox}>
//         <Text style={styles.rank}>{rank}</Text>
//         <View>
//           <Text>{content}</Text>
//           <View style={styles.bottomBox}>
//             <View style={styles.bottomSubBox}>
//               <Icon name="comment" size={30} />
//               <Text style={styles.num}>{commentCount}</Text>
//             </View>
//             <View style={styles.bottomSubBox}>
//               <Icon name="thumb-up" size={30} color="gray" />
//               <Text style={styles.num}>{likeCount}</Text>
//             </View>
//             <View style={styles.bottomSubBox}>
//               <Icon name="thumb-down" size={30} color="gray" />
//               <Text style={styles.num}>{disLikeCount}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default FunnyPost;

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {updateState} from '../recoil/postState';
import {useRecoilState} from 'recoil';
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

interface FunnyPostProps {
  data: {
    post_id: number;
    user_id: number;
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
  };
  handleGoToDetail: () => void;
  setIsWriteMode: any;
}

const FunnyPost = (props: FunnyPostProps) => {
  const [userId, setUserId] = useState('');
  const [_, setIsUpdated] = useRecoilState(updateState);

  const {
    post_id,
    nick_name,
    user_id,
    // image_url,
    post_content,
    comment_count,
    like_count,
    hate_count,
    like_status,
    hate_status,
  } = props.data;

  const {handleGoToDetail, setIsWriteMode} = props;

  const toggleLike = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;

    fetch(`${API_URL}/post/like/${post_id}`, {
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

    fetch(`${API_URL}/post/hate/${post_id}`, {
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

  useEffect(() => {
    async function fetchData() {
      const userData = await AsyncStorage.getItem('userData');
      setUserId(JSON.parse(userData!)?.user_id);
    }
    fetchData();
  }, []);

  const isPostWriter = user_id === Number(userId);

  const deletePost = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;

    fetch(`${API_URL}/post/${post_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(response => {
      setIsUpdated(true);
      setIsUpdated(false);
    });
  };

  const setPostId = async () => {
    await AsyncStorage.setItem('post_id', String(post_id));
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        await setPostId();
        handleGoToDetail();
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

export default FunnyPost;
