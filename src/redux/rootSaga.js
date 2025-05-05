import { all } from 'redux-saga/effects';
import {
  watchLogin,
  watchFetchProfile,
  watchUpdateProfile,
} from './authSaga';

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchFetchProfile(),
    watchUpdateProfile(), // Added watcher for profile update
  ]);
}