// socialSaga.js
import { takeLatest, call, put, all } from "redux-saga/effects";
import axios from "axios";
import {
  setTailors,
  setRatings,
  setUserRating,
  setFollowerList,
  updateFollowers,
  setLoadingFollowId,
  setSubmittingRatingId,
} from "./socialSlice";

const BASE_URL = "http://localhost:5000";

function* fetchTailorsSaga() {
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(axios.get, `${BASE_URL}/tailors/alltailors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setTailors(data.tailors));
    const ratings = {};
    const userRatings = {};
    for (const tailor of data.tailors) {
      const ratingResponse = yield call(axios.get, `${BASE_URL}/tailors/ratings/${tailor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ratingResponse.data.averageRating !== undefined) {
        ratings[tailor._id] = ratingResponse.data.averageRating;
      }
      if (ratingResponse.data.userRating !== undefined) {
        userRatings[tailor._id] = ratingResponse.data.userRating;
      }
    }
    yield put(setRatings(ratings));
    yield put(setUserRating(userRatings));
  } catch (err) {
    console.error("Fetch Tailors Failed:", err);
  }
}

function* submitRatingSaga(action) {
  const { tailorId, rating } = action.payload;
  try {
    const token = localStorage.getItem("token");
    yield put(setSubmittingRatingId(tailorId));
    const { data } = yield call(axios.post, `${BASE_URL}/tailors/rate`, { tailorId, rating }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setRatings({ [tailorId]: data.averageRating }));
    yield put(setUserRating({ [tailorId]: rating }));
  } catch (err) {
    console.error("Rating Failed:", err);
  } finally {
    yield put(setSubmittingRatingId(null));
  }
}

function* toggleFollowSaga(action) {
  const { tailorId } = action.payload;
  try {
    const token = localStorage.getItem("token");
    yield put(setLoadingFollowId(tailorId));

    const url = action.payload.isFollowing
      ? `${BASE_URL}/tailors/unfollow/${tailorId}`
      : `${BASE_URL}/tailors/follow/${tailorId}`;

    // ✅ Send request to follow/unfollow
    yield call(axios.post, url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Fetch updated followers from backend
    const { data } = yield call(axios.get, `${BASE_URL}/tailors/followers/${tailorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Update both UI sources
    yield put(updateFollowers({ tailorId, followers: data.followers }));
    yield put(setFollowerList({ tailorId, followers: data.followers }));
  } catch (err) {
    console.error("Follow/Unfollow Failed:", err);
  } finally {
    yield put(setLoadingFollowId(null));
  }
}


function* fetchFollowersSaga(action) {
  const tailorId = action.payload;
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(axios.get, `${BASE_URL}/tailors/followers/${tailorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setFollowerList({ tailorId, followers: data.followers })); // ✅ send tailorId with followers
  } catch (err) {
    console.error("Fetch Followers Failed:", err);
  }
}


export function* watchSocial() {
  yield all([
    takeLatest("FETCH_TAILORS", fetchTailorsSaga),
    takeLatest("SUBMIT_RATING", submitRatingSaga),
    takeLatest("TOGGLE_FOLLOW", toggleFollowSaga),
    takeLatest("FETCH_FOLLOWERS", fetchFollowersSaga),
  ]);
}
