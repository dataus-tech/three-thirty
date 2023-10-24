import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  registerContainer: {
    height: screenHeight,
    width: screenWidth,
  },
  slogan: {
    paddingTop: 100,
    paddingLeft: 30,
    fontSize: 40,
    fontWeight: '800',
    width: screenWidth * 0.9,
    color: '#1a9988',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    width: screenWidth * 0.9,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a9988',
  },
  kakaoButton: {
    width: screenWidth * 0.9,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a9988',
    margin: 10,
  },
  buttonBox: {
    width: screenWidth * 0.9,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a9988',
  },
  question: {
    marginTop: 50,
    // alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: screenWidth,
  },
});

interface RegisterMainScreenProps {
  navigation: NavigationProp<any>;
}

const RegisterMainScreen = ({navigation}: RegisterMainScreenProps) => {
  // const handleLinkPress = async () => {
  //   const url = '/oauth2/authorization/kakao';
  //   const supported = await Linking.canOpenURL(url);

  //   if (supported) {
  //     await Linking.openURL(url);
  //   }
  // };

  return (
    <View style={styles.registerContainer}>
      <Text style={styles.slogan}>개미들이 성공하는 그날까지!!</Text>
      <View style={styles.bottomContainer}>
        {/* <TouchableHighlight onPress={handleLinkPress}>
          <Text>Kakao Login</Text>
        </TouchableHighlight> */}
        <TouchableOpacity onPress={() => Alert.alert('구글 로그인')}>
          <View style={styles.socialButton}>
            <Text>Continue with Google</Text>

            {/* <Button
              title="Continue with Google"
              onPress={() => Alert.alert('구글 로그인')}
            /> */}
            {/* <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => Alert.alert('구글 로그인')}
          /> */}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('카카오 로그인')}>
          <View style={styles.kakaoButton}>
            <Text>Continue with Kakao Talk</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserInfo')}>
          <View style={styles.buttonBox}>
            <Text>Create Account</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.question}>이미 계정이 있으신가요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={styles.buttonBox}>
            <Text>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterMainScreen;
