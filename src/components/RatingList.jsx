import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { setSelectedUser } from "../redux/socialSlice"; // ✅ import

const RatingList = ({ tailorId, showRatingId, setShowRatingId, defaultRatings = [] }) => {
  const dispatch = useDispatch();
  const ratingList = useSelector((state) => state.social.ratedUsersList);

  // ✅ Fetch rated users if not already available
  useEffect(() => {
    if (!ratingList[tailorId]) {
      dispatch({ type: "FETCH_RATED_USERS", payload: tailorId });
    }
  }, [dispatch, ratingList, tailorId]);

  const ratings = useMemo(() => ratingList?.[tailorId] || defaultRatings, [ratingList, tailorId, defaultRatings]);

  const handleViewRatings = () => {
    setShowRatingId(tailorId);
  };

  const handleClose = () => {
    setShowRatingId(null);
    dispatch(setSelectedUser(null)); // ✅ clear stale user
  };

  return (
    <>
      <p className="text-yellow-600 cursor-pointer font-semibold" onClick={handleViewRatings}>
        Rated By: {ratings.length}
      </p>

      {showRatingId === tailorId && ratings.length > 0 && (
        <div className="bg-yellow-50 p-3 mt-2 rounded">
          <h4 className="font-bold mb-2">Rated By Users:</h4>
          {ratings.map((user, i) => (
            <div key={`${user._id}-${i}`} className="flex items-center justify-between mb-1">
              <p>
                {user.name} - ⭐ {user.rating}
              </p>
              <ViewProfileButton userId={user._id} />
            </div>
          ))}
          <button
            className="mt-2 text-sm text-red-600"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default RatingList;
