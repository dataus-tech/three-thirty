import {atom} from 'recoil';

export const updateState = atom({
  key: 'updateState',
  default: false,
});

export const postTypeState = atom({
  key: 'postTypeState',
  default: 'general',
});

export const postIdState = atom({
  key: 'postIdState',
  default: 0,
});
