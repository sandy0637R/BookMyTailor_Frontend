import { all } from 'redux-saga/effects';
import { watchLogin, watchFetchProfile } from './authSaga';

export default function* rootSaga() {
  yield all([watchLogin(), watchFetchProfile()]);
}
