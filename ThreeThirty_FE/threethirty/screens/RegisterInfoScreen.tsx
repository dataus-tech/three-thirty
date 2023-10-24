import React, {useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  desc: {
    margin: 10,
    padding: 10,
  },
  input: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  nextButton: {
    height: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1a9988',
    top: 100,
  },
});

interface RegisterInfoScreenProps {
  navigation: NavigationProp<any>;
}

const RegisterInfoScreen = ({navigation}: RegisterInfoScreenProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const resetBaseInfo = () => {
    setEmail('');
    setName('');
    setPassword('');
    setPasswordConfirm('');
  };

  const userBaseInfo = {email, name, password};

  return (
    <View>
      <Text style={styles.desc}>Create Your Account</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email Address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPasswordConfirm}
        value={passwordConfirm}
        placeholder="Password Confirm"
        secureTextEntry={true}
      />

      <TouchableNativeFeedback
        onPress={() => {
          navigation.navigate('UserProfileInfo', {userBaseInfo, resetBaseInfo});
        }}>
        <View style={styles.nextButton}>
          <Text>Next</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default RegisterInfoScreen;
