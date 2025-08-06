import { all } from 'redux-saga/effects';
import {
  watchLogin,
  watchFetchProfile,
  watchUpdateProfile,
  watchGetCloths,
  watchAddToWishlist,
  watchRemoveFromWishlist,
  watchAddToCart,
  watchRemoveFromCart,
  watchGetClothById,
  watchClearCart,
} from './authSaga';

import { watchSocial } from './socialSaga';
import { watchPost } from './postSaga';
import { watchCustom } from './customSaga';
import { watchMeasurement } from "./measurementSaga";
import {watchChat} from "./chatSaga"
import {watchCloth} from "./clothSaga"
import {watchAdmin} from "./adminSaga"
import { watchOrder } from './orderSaga';
export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchFetchProfile(),
    watchUpdateProfile(), // Added watcher for profile update
    watchGetCloths(),
     watchAddToWishlist(),
    watchRemoveFromWishlist(),
    watchAddToCart(),
    watchRemoveFromCart(),
    watchSocial(),
    watchPost(),
    watchGetClothById(),
    watchCustom(),
    watchMeasurement(),
    watchChat(),
    watchCloth(),
    watchAdmin(),
    watchClearCart(),
    watchOrder(),
  ]);
}