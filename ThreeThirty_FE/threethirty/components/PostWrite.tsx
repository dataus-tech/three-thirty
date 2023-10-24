import {API_URL} from '@env';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState} from '../recoil/userState';
import {postTypeState} from '../recoil/postState';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  companyInput: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.1,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
  },
});

const PostWrite = ({isWriteMode, setIsWriteMode}: any) => {
  const post = isWriteMode.post;
  const isEditMode = isWriteMode.edit;
  const [text, setText] = useState('');
  const [company, setCompany] = useState('');
  const hashtags = text.match(/#[\wㄱ-ㅎㅏ-ㅣ가-힣]+/g) || [''];
  const postId = post?.post_id;
  useEffect(() => {
    if (isEditMode) {
      setText(post.post_content);
      setCompany(post.company_title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user: any = useRecoilValue(userState);
  const setUserData = useSetRecoilState(userState);

  const storeData = async (userData: any) => {
    try {
      setUserData(userData);
    } catch (error) {
      console.error(error);
    }
  };
  const postType = useRecoilValue(postTypeState);

  const writePost = async () => {
    try {
      const accessToken = JSON.parse(user!)?.accessToken;
      const refreshToken = JSON.parse(user!)?.refreshToken;

      const response = await fetch(`${API_URL}/post/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          post_type_title: postType,
          company_title: company,
          post_content: text,
          hashtag_content: hashtags,
          attach_file: [
            {
              attach_file_url: 'http://example.com/file1.pdf',
              attach_file_type: 'pdf',
            },
            {
              attach_file_url: 'http://example.com/image.jpg',
              attach_file_type: 'image',
            },
          ],
        }),
      });
      const resp = await response.json();
      const message = JSON.stringify(resp.message);
      const status = JSON.stringify(response.status);

      if (message === ('"기간이 만료된 토큰"' && '"유효하지 않은 토큰"')) {
        if (refreshToken) {
          const newResp = await fetch(`${API_URL}/users/refreshToken`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          const newStatus = JSON.stringify(newResp.status);
          if (newStatus === '200') {
            const reponseData = await newResp.json();
            const newUserData = JSON.stringify(reponseData);
            storeData(newUserData);

            const newResponse = await fetch(`${API_URL}/post/create`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                post_type_title: postType,
                company_title: company,
                post_content: text,
                hashtag_content: hashtags,
                attach_file: [
                  {
                    attach_file_url: 'http://example.com/file1.pdf',
                    attach_file_type: 'pdf',
                  },
                  {
                    attach_file_url: 'http://example.com/image.jpg',
                    attach_file_type: 'image',
                  },
                ],
              }),
            });
            const resStatus = JSON.stringify(newResponse.status);
            if (resStatus === '200') {
              Alert.alert('게시물 작성이 완료되었습니다.');
              setIsWriteMode(false);
            }
          }
        }
      } else if (status === '200') {
        Alert.alert('게시물 작성이 완료되었습니다.');
        setIsWriteMode(false);
      } else {
        Alert.alert('게시물 작성에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editPost = async () => {
    const accessToken = JSON.parse(user!)?.accessToken;

    fetch(`${API_URL}/post/${postId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        company_title: company,
        post_content: text,
        hashtag_content: hashtags,
        attach_file: [
          {
            attach_file_url: 'http://example.com/file1.pdf',
            attach_file_type: 'pdf',
          },
          {
            attach_file_url: 'http://example.com/image.jpg',
            attach_file_type: 'image',
          },
        ],
      }),
    }).then(response => {
      const status = JSON.stringify(response?.status);

      if (status === '401') {
        Alert.alert('토큰 만료');
      }
      if (status === '200') {
        Alert.alert('게시물 수정이 완료되었습니다.');
        setIsWriteMode(false);
      } else {
        Alert.alert('게시물 수정에 실패했습니다.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.companyInput}
        onChangeText={setCompany}
        value={company}
        placeholder="회사명을 작성해주세요"
        placeholderTextColor={'black'}
      />
      <TextInput
        multiline={true}
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="글을 작성해주세요"
        placeholderTextColor={'black'}
      />
      <Button
        title={isEditMode ? '수정하기' : '작성하기'}
        onPress={isEditMode ? editPost : writePost}
      />
      <Button
        title="취소하기"
        onPress={() => {
          setIsWriteMode(false);
        }}
      />
    </View>
  );
};

export default PostWrite;
