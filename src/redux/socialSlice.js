// socialSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tailors: [],
  ratings: {},
  userRating: {},
  followerList: {},
  loadingFollowId: null,
  submittingRatingId: null,
};

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setTailors: (state, action) => {
      state.tailors = action.payload;
    },
    setRatings: (state, action) => {
      state.ratings = { ...state.ratings, ...action.payload };
    },
    setUserRating: (state, action) => {
      state.userRating = { ...state.userRating, ...action.payload };
    },
   setFollowerList: (state, action) => {
  const { tailorId, followers } = action.payload;
  state.followerList[tailorId] = followers;
},

    updateFollowers: (state, action) => {
      const { tailorId, followers } = action.payload;
      state.tailors = state.tailors.map((tailor) =>
        tailor._id === tailorId
          ? {
              ...tailor,
              tailorDetails: {
                ...tailor.tailorDetails,
                followers,
              },
            }
          : tailor
      );
    },
    setLoadingFollowId: (state, action) => {
      state.loadingFollowId = action.payload;
    },
    setSubmittingRatingId: (state, action) => {
      state.submittingRatingId = action.payload;
    },
  },
});

export const {
  setTailors,
  setRatings,
  setUserRating,
  setFollowerList,
  updateFollowers,
  setLoadingFollowId,
  setSubmittingRatingId,
} = socialSlice.actions;

export default socialSlice.reducer;
