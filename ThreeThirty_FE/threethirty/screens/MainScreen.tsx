import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Post from '../components/Post';
import PostWrite from '../components/PostWrite';
import useGetPost from '../hooks/useGetPost';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00b0f0',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

interface MainScreenProps {
  category: string | undefined;
}

const MainScreen = (props: MainScreenProps) => {
  const {category} = props;
  const [isWriteMode, setIsWriteMode] = useState(false);

  const handleFloatingButtonPress = () => {
    setIsWriteMode(true);
  };
  const navigation = useNavigation();

  const handleGoToDetail = (post_id: number) => {
    navigation.navigate('Detail', {post_id});
  };

  const data = useGetPost(category, isWriteMode);

  return (
    <>
      {isWriteMode ? (
        <PostWrite isWriteMode={isWriteMode} setIsWriteMode={setIsWriteMode} />
      ) : (
        <View style={styles.container}>
          <ScrollView>
            {data.map(post => (
              <Post
                key={post.post_id}
                data={post}
                handleGoToDetail={handleGoToDetail}
                setIsWriteMode={setIsWriteMode}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleFloatingButtonPress}>
            <Icon name="create" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default MainScreen;
