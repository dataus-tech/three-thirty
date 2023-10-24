import React from 'react';
import AuthNavigation from './navigations/AuthNavigation';
import TabNavigation from './navigations/TabNavigation';
import {useRecoilState} from 'recoil';
import {userState} from './recoil/userState';

function App(): JSX.Element {
  const [userData] = useRecoilState(userState);

  const isLoggedIn = !!userData;

  return isLoggedIn ? <TabNavigation /> : <AuthNavigation />;
}

export default App;
