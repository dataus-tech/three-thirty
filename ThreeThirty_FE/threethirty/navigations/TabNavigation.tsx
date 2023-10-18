/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import SearchHeader from '../components/SearchHeader';
import CommunityHeader from '../components/CommunityHeader';
import NotificationHeader from '../components/NotificationHeader';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CommunityScreen from '../screens/CommunityScreen';
import FollowingScreen from '../screens/FollowingScreen';
import {createStackNavigator} from '@react-navigation/stack';
import DetailScreen from '../screens/DetailScreen';
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const NoTabNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

function TabNavigation({updateUserInfo}: any) {
  const [screen, setScreen] = useState('main');

  const category = () => {
    if (screen === 'main') {
      return 'general';
    } else if (screen === 'threeThirty') {
      return 'threethirty';
    } else if (screen === 'funny') {
      return 'best';
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Detail"
          component={NoTabNavigator}
          options={{
            tabBarButton: () => null,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Home"
          component={() => {
            return screen === 'following' ? (
              <FollowingScreen />
            ) : (
              <MainScreen category={category()} />
            );
          }}
          options={{
            title: '홈',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
            headerTitle: () => {
              return (
                <Header setScreen={setScreen} updateUserInfo={updateUserInfo} />
              );
            },
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: '검색',
            tabBarIcon: ({color, size}) => (
              <Icon name="search" color={color} size={size} />
            ),
            headerTitle: () => <SearchHeader />,
          }}
        />
        <Tab.Screen
          name="Community"
          component={CommunityScreen}
          options={{
            title: '커뮤니티',
            tabBarIcon: ({color, size}) => (
              <Icon name="people" color={color} size={size} />
            ),
            headerTitle: () => <CommunityHeader />,
          }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            title: '알림',
            tabBarIcon: ({color, size}) => (
              <Icon name="notifications" color={color} size={size} />
            ),
            headerTitle: () => <NotificationHeader />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabNavigation;
