import React, {Dispatch, SetStateAction} from 'react';
import {View, TouchableWithoutFeedback, Text, StyleSheet} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {postTypeState} from '../recoil/postState';
import TabAvatar from './TabAvatar';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 20,
  },
  box: {
    marginHorizontal: 10,
  },
  text: {
    color: 'gray',
  },
  line: {
    width: 2,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
});

interface HeaderProps {
  setScreen: Dispatch<SetStateAction<any>>;
}

const Header = ({setScreen}: HeaderProps) => {
  const setPostType = useSetRecoilState(postTypeState);
  return (
    <View>
      <TabAvatar />
      <View style={styles.header}>
        <View style={styles.box}>
          <TouchableWithoutFeedback
            onPress={() => {
              setScreen('main');
              setPostType('general');
            }}>
            <Text style={styles.text}>Main</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.line} />
        <View style={styles.box}>
          <TouchableWithoutFeedback
            onPress={() => {
              setScreen('threeThirty');
              setPostType('threeThirty');
            }}>
            <Text style={styles.text}>3:30</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.line} />
        <View style={styles.box}>
          <TouchableWithoutFeedback
            onPress={() => {
              setScreen('funny');
              setPostType('general');
            }}>
            <Text style={styles.text}>Funny</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.line} />
        <View style={styles.box}>
          <TouchableWithoutFeedback
            onPress={() => {
              setScreen('following');
              setPostType('general');
            }}>
            <Text style={styles.text}>Following</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

export default Header;
