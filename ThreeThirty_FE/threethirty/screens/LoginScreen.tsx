import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import {API_URL} from '@env';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  input: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  loginContainer: {
    width: screenWidth,
  },
  logoBox: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    padding: 10,
    marginTop: 50,
    marginBottom: 50,
  },
  loginButton: {
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

const LoginScreen = ({updateUserInfo}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('userData', userData);
    } catch (error) {
      console.error(error);
    }
  };

  const login = () => {
    if (email === '' || password === '') {
      Alert.alert('사용자 정보를 입력해주세요.');
    } else {
      fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: email,
          pw: password,
        }),
      })
        .then(response => {
          const status = JSON.stringify(response?.status);

          if (status === '200') {
            return response.json();
          } else {
            return null;
          }
        })
        .then(res => {
          const userData = JSON.stringify(res);
          if (email !== '' && password !== '') {
            if (userData === 'null') {
              Alert.alert('사용자 정보를 확인해주세요.');
            } else {
              Alert.alert('로그인이 완료되었습니다.');
              storeData(userData);
              updateUserInfo();
              setEmail('');
              setPassword('');
            }
          }
        })
        .catch(err => {
          alert(err);
          console.error(err);
        });
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.logoBox}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('../assets/three-thirty-logo.png')}
        />
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email Address or phone number"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={login}>
        <View style={styles.loginButton}>
          <Text>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
