import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

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

const PostWrite = ({isWriteMode, setIsWriteMode, isThreeThirty}: any) => {
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
  }, []);

  const writePost = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;

    fetch(`${API_URL}/post/create`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        post_type_title: isThreeThirty ? 'threeThirty' : 'general',
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
        Alert.alert('게시물 작성이 완료되었습니다.');
        setIsWriteMode(false);
      } else {
        Alert.alert('게시물 작성에 실패했습니다.');
      }
    });
  };

  const editPost = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const accessToken = JSON.parse(userData!)?.accessToken;

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
