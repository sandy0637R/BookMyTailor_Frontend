// postSaga.js
import { takeLatest, call, put, all, select } from "redux-saga/effects";
import axios from "axios";
import {
  setPosts,
  updatePost,
  setCommentTexts,
  setSelectedCommentId,
  setUserId,
} from "./postSlice";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:5000";

// Fetch posts with comments
function* fetchPostsSaga() {
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(axios.get, `${BASE_URL}/tailors/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const postsWithComments = yield all(
      data.map(function* (post) {
        try {
          const { data: comments } = yield call(
            axios.get,
            `${BASE_URL}/tailors/posts/${post._id}/comments`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const mappedComments = comments.map((cmt) => ({
            _id: cmt._id,
            text: cmt.commentText,
            userId: cmt.userId,
            commentedBy: { name: cmt.userName },
            createdAt: cmt.createdAt,
          }));
          return { ...post, comments: mappedComments };
        } catch {
          return { ...post, comments: [] };
        }
      })
    );

    yield put(setPosts(postsWithComments));
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }
}

// Like post
function* likePostSaga(action) {
  const { postId } = action.payload;
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.put,
      `${BASE_URL}/tailors/posts/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const currentPosts = yield select((state) => state.post.posts);
    const oldPost = currentPosts.find((p) => p._id === postId);

    const updatedPost = {
      ...data.post,
      postedBy: oldPost?.postedBy,
      comments: oldPost?.comments,
    };

    yield put(updatePost(updatedPost));
  } catch (err) {
    console.error("Failed to like post:", err);
  }
}

// Add comment
function* commentPostSaga(action) {
  const { postId, text } = action.payload;
  try {
    const token = localStorage.getItem("token");
    const { data } = yield call(
      axios.post,
      `${BASE_URL}/tailors/posts/${postId}/comment`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const c = data.comment;
    if (!c?._id) {
      console.error("❌ Comment ID is missing. Skipping add.");
      return;
    }

    const userName = yield select((state) => state.auth.profile?.name);
    const newComment = {
      _id: c._id,
      text: c.commentText,
      userId: c.userId,
      commentedBy: { name: c.userName || userName || "You" },
      createdAt: c.createdAt,
    };

    const posts = yield select((state) => state.post.posts);
    const updatedPosts = posts.map((post) =>
      post._id === postId
        ? { ...post, comments: [...(post.comments || []), newComment] }
        : post
    );

    yield put(setPosts(updatedPosts));
    yield put(setCommentTexts({ [postId]: "" }));
  } catch (err) {
    console.error("❌ Failed to comment:", err);
  }
}



// Delete comment
function* deleteCommentSaga(action) {
  const { postId, commentId } = action.payload;
  try {
    const token = localStorage.getItem("token");
    yield call(
      axios.delete,
      `${BASE_URL}/tailors/posts/${postId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const currentPosts = yield select((state) => state.post.posts);
    const updatedPosts = currentPosts.map((post) =>
      post._id === postId
        ? {
            ...post,
            comments: post.comments.filter((cmt) => cmt._id !== commentId),
          }
        : post
    );

    yield put(setPosts(updatedPosts));
  } catch (err) {
    console.error("Failed to delete comment:", err);
  }
}

// Set user ID from token
function* setUserFromTokenSaga() {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    yield put(setUserId(decoded?._id));
  }
}

export function* watchPost() {
  yield all([
    takeLatest("FETCH_POSTS", fetchPostsSaga),
    takeLatest("LIKE_POST", likePostSaga),
    takeLatest("COMMENT_POST", commentPostSaga),
    takeLatest("DELETE_COMMENT", deleteCommentSaga),
    takeLatest("SET_USER_FROM_TOKEN", setUserFromTokenSaga),
  ]);
}
