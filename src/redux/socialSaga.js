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
  setFollowingList,
  setRatedUsers,
  updateTailor,
  setSelectedUser, // ✅ NEW
} from "./socialSlice";

const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://bookmytailor-backend.onrender.com";

function* fetchTailorsSaga() {
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(axios.get, `${BASE_URL}/tailors/alltailors`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tailors = data.tailors || data;
    yield put(setTailors(tailors));

    const ratings = {};
    for (const tailor of tailors) {
      ratings[tailor._id] = tailor.tailorDetails?.averageRating || 0;
    }

    yield put(setRatings(ratings));
  } catch (err) {
    console.error("Fetch Tailors Failed:", err);
  }
}

function* fetchTailorSaga(action) {
  const { tailorId } = action.payload;

  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.get,
      `${BASE_URL}/tailors/${tailorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tailor = data.tailor || data;
    yield put(updateTailor(tailor));

    const ratingResponse = yield call(
      axios.get,
      `${BASE_URL}/tailors/ratings/${tailorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (ratingResponse.data?.averageRating !== undefined) {
      yield put(setRatings({ [tailorId]: ratingResponse.data.averageRating }));
    }

    if (ratingResponse.data?.userRating !== undefined) {
      yield put(setUserRating({ [tailorId]: ratingResponse.data.userRating }));
    }

  } catch (err) {
    console.error("Fetch Tailor Failed:", err);
  }
}

function* fetchUserByIdSaga(action) {
  const { userId, callback } = action.payload;
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.get,
      `${BASE_URL}/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    yield put({ type: "social/setSelectedUser", payload: data }); // ✅ Save to store

    if (callback) callback(data);
  } catch (err) {
    console.error("Fetch user by ID failed:", err);
  }
}

function* submitRatingSaga(action) {
  const { tailorId, rating } = action.payload;
  try {
    const token = localStorage.getItem("token");
    yield put(setSubmittingRatingId(tailorId));
    const { data } = yield call(
      axios.post,
      `${BASE_URL}/tailors/rate`,
      { tailorId, rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    yield put(setRatings({ [tailorId]: data.averageRating }));
    yield put(setUserRating({ [tailorId]: rating }));
    yield put({ type: "FETCH_RATED_USERS", payload: tailorId });
  } catch (err) {
    console.error("Rating Failed:", err);
  } finally {
    yield put(setSubmittingRatingId(null));
  }
}

function* toggleFollowSaga(action) {
  const { tailorId, isFollowing, currentUserId } = action.payload;

  try {
    const token = localStorage.getItem("token");
    yield put(setLoadingFollowId(tailorId));

    const url = isFollowing
      ? `${BASE_URL}/tailors/unfollow/${tailorId}`
      : `${BASE_URL}/tailors/follow/${tailorId}`;

    yield call(axios.post, url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { data: followerData } = yield call(
      axios.get,
      `${BASE_URL}/tailors/followers/${tailorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    yield put(updateFollowers({ tailorId, followers: followerData.followers }));
    yield put(setFollowerList({ tailorId, followers: followerData.followers }));

    const { data: followingData } = yield call(
      axios.get,
      `${BASE_URL}/users/${currentUserId}/following`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const uniqueFollowing = [];
    const seen = new Set();
    for (const user of followingData.following) {
      const idStr = user._id.toString();
      if (!seen.has(idStr)) {
        seen.add(idStr);
        uniqueFollowing.push(user);
      }
    }

    yield put(setFollowingList({ userId: currentUserId, following: uniqueFollowing }));
  } catch (err) {
    console.error("❌ Follow/Unfollow Failed:", err);
  } finally {
    yield put(setLoadingFollowId(null));
  }
}

function* fetchFollowersSaga(action) {
  const tailorId = action.payload;
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.get,
      `${BASE_URL}/tailors/followers/${tailorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    yield put(setFollowerList({ tailorId, followers: data.followers }));
  } catch (err) {
    console.error("Fetch Followers Failed:", err);
  }
}

function* fetchFollowingListSaga(action) {
  const userId = action.payload;

  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.get,
      `${BASE_URL}/users/${userId}/following`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const uniqueFollowing = [];
    const seen = new Set();
    for (const user of data.following) {
      const idStr = user._id.toString();
      if (!seen.has(idStr)) {
        seen.add(idStr);
        uniqueFollowing.push(user);
      }
    }

    yield put(setFollowingList({ userId, following: uniqueFollowing }));
  } catch (err) {
    console.error("❌ Fetch Following List Failed:", err);
  }
}

function* fetchRatedUsersSaga(action) {
  const tailorId = action.payload;

  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.get,
      `${BASE_URL}/users/tailors/${tailorId}/rated-users`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    yield put(setRatedUsers({ tailorId, ratedUsers: data.ratedUsers }));
  } catch (err) {
    console.error("❌ Fetch Rated Users Failed:", err);
  }
}

export function* watchSocial() {
  yield all([
    takeLatest("FETCH_TAILORS", fetchTailorsSaga),
    takeLatest("FETCH_TAILOR", fetchTailorSaga),
    takeLatest("SUBMIT_RATING", submitRatingSaga),
    takeLatest("TOGGLE_FOLLOW", toggleFollowSaga),
    takeLatest("FETCH_FOLLOWERS", fetchFollowersSaga),
    takeLatest("FETCH_FOLLOWING_LIST", fetchFollowingListSaga),
    takeLatest("FETCH_RATED_USERS", fetchRatedUsersSaga),
    takeLatest("FETCH_USER_BY_ID", fetchUserByIdSaga),
  ]);
}
