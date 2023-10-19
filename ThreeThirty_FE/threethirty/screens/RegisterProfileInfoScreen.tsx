import React, {useMemo, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import {MediaType, launchImageLibrary} from 'react-native-image-picker';
import AuthAvatar from '../components/AuthAvatar';
import {API_URL} from '@env';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  selectButton: {
    top: 30,
    marginBottom: 100,
  },
  input: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  notification: {
    margin: 10,
  },
  complete: {
    width: screenWidth * 0.95,
    margin: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a9988',
  },
});

type ImageSource = {uri: string | undefined} | undefined;

const RegisterProfileInfoScreen = ({route, navigation}: any) => {
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: '동의',
        value: 'option1',
      },
      {
        id: '2',
        label: '동의하지 않음',
        value: 'option2',
      },
    ],
    [],
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const {userBaseInfo, resetBaseInfo} = route.params;
  const {email, name, password} = userBaseInfo;

  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [selectedImage, setSelectedImage] = useState<ImageSource>(undefined);
  const openImagePicker = () => {
    const options = {
      title: '이미지 선택',
      cancelButtonTitle: '취소',
      takePhotoButtonTitle: '카메라로 촬영',
      chooseFromLibraryButtonTitle: '갤러리에서 선택',
      mediaType: 'photo' as MediaType,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('사용자가 선택을 취소했습니다.');
      } else if (response.errorCode) {
        console.error('이미지 선택 중 오류 발생:', response.errorCode);
      } else {
        if (response.assets) {
          const source = {uri: response.assets[0].uri};
          setSelectedImage(source);
        }
      }
    });
  };
  const imgUrl = selectedImage?.uri;
  const norificationStatus = selectedId === '1';

  const resetUserInfo = () => {
    setNickname('');
    setSelectedId(undefined);
    setSelectedImage(undefined);
    setPhoneNumber('');
    resetBaseInfo();
  };

  const register = () => {
    fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: email,
        user_name: name,
        pw: password,
        phone_number: phoneNumber,
        image_url: imgUrl,
        nick_name: nickname,
        notification_status: norificationStatus,
      }),
    }).then(response => {
      const status = JSON.stringify(response?.status);
      if (status === '201') {
        Alert.alert('회원가입이 완료되었습니다.');
        resetUserInfo();
        navigation.navigate('Login');
      } else {
        Alert.alert('회원가입에 실패했습니다.');
      }
    });
  };

  return (
    <View>
      <AuthAvatar source={selectedImage} />
      <View style={styles.selectButton}>
        <Button title="파일 선택" onPress={openImagePicker} />
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setNickname}
        value={nickname}
        placeholder="NickName"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholder="PhoneNumber"
      />
      <Text style={styles.notification}>알림 설정</Text>
      <RadioGroup
        layout="row"
        radioButtons={radioButtons}
        onPress={setSelectedId}
        selectedId={selectedId}
      />
      <TouchableOpacity
        onPress={() => {
          register();
        }}
        style={styles.complete}>
        <View>
          <Text>Complete</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterProfileInfoScreen;
