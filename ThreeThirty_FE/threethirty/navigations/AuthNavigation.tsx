/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {Button} from 'react-native';
// import {GoogleSigninButton} from 'react-native-google-signin';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterMainScreen from '../screens/RegisterMainScreen';
import RegisterInfoScreen from '../screens/RegisterInfoScreen';
import RegisterProfileInfoScreen from '../screens/RegisterProfileInfoScreen';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: 'white',
        },
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={RegisterMainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserInfo"
          component={RegisterInfoScreen}
          options={({navigation}) => ({
            headerTitle: '세시반',
            headerLeft: () => (
              <Button title="Cancel" onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen
          name="UserProfileInfo"
          component={RegisterProfileInfoScreen}
          options={({navigation}) => ({
            headerTitle: '',
            headerLeft: () => (
              <Button title="Cancel" onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen
          name="Login"
          component={() => <LoginScreen />}
          options={({navigation}) => ({
            headerLeft: () => (
              <Button title="Cancel" onPress={() => navigation.goBack()} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigation;
