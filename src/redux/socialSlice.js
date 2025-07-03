// socialSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tailors: [],
  ratings: {},
  userRating: {},
  followerList: {},
  followingList: {},      // ✅ added
  ratedUsersList: {},
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
setFollowingList: (state, action) => {
  const { userId, following } = action.payload;
  state.followingList[userId] = following;
},

setRatedUsers: (state, action) => {
  const { tailorId, ratedUsers } = action.payload;
  state.ratedUsersList[tailorId] = ratedUsers;
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

    // In socialSlice.js, add this reducer:
updateTailor: (state, action) => {
  const updatedTailor = action.payload;
  const existingIndex = state.tailors.findIndex(t => t._id === updatedTailor._id);
  
  if (existingIndex >= 0) {
    state.tailors[existingIndex] = updatedTailor;
  } else {
    state.tailors.push(updatedTailor);
  }
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
   setFollowingList,      // ✅
  setRatedUsers,
  updateTailor,
} = socialSlice.actions;

export default socialSlice.reducer;
