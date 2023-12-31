import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Alert} from 'react-native';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  avatarContainer: {
    right: 30,
    alignItems: 'flex-end',
    width: screenWidth,
    top: 10,
  },
  avatarBox: {
    width: 40,
    height: 40,
    backgroundColor: 'lightgray',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    position: 'absolute',
    top: 40,
    zIndex: 100,
    backgroundColor: 'white',
    width: 80,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    marginVertical: 4,
  },
});

const TabAvatar = ({updateUserInfo}: any) => {
  const [isButtonBoxOpened, setIsButtonBoxOpened] = useState(false);
  const logOut = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const refreshToken = JSON.parse(userData!)?.refreshToken;

    fetch('http://localhost:8080/users/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    }).then(response => {
      const status = JSON.stringify(response?.status);
      if (status === '200') {
        AsyncStorage.removeItem('userData');
        Alert.alert('로그아웃 되었습니다.');
      } else {
        Alert.alert('로그아웃에 실패했습니다.');
      }
    });

    await AsyncStorage.removeItem('userData');
    await updateUserInfo();
  };

  const openButtonBox = () => {
    setIsButtonBoxOpened(true);
  };

  const closeButtonBox = () => {
    setIsButtonBoxOpened(false);
  };

  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatarBox}>
        <TouchableWithoutFeedback onPress={openButtonBox}>
          <Icon name="person" size={30} color="gray" />
        </TouchableWithoutFeedback>
      </View>
      {isButtonBoxOpened ? (
        <View style={styles.buttons}>
          <TouchableWithoutFeedback onPress={closeButtonBox}>
            <View style={styles.button}>
              <Text>닫기</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={logOut}>
            <View style={styles.button}>
              <Text>로그아웃</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      ) : null}
    </View>
  );
};

export default TabAvatar;
