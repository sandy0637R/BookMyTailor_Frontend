import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const RatingList = ({ tailorId, showRatingId, setShowRatingId, defaultRatings = [] }) => {
  const dispatch = useDispatch();
  const ratingList = useSelector((state) => state.social.ratedUsersList);

  // ✅ Automatically fetch rated users on mount or refresh
  useEffect(() => {
    if (!ratingList[tailorId]) {
      dispatch({ type: "FETCH_RATED_USERS", payload: tailorId });
    }
  }, [dispatch, ratingList, tailorId]);

  // ✅ Memoized ratings list
  const ratings = useMemo(() => ratingList?.[tailorId] || defaultRatings, [ratingList, tailorId, defaultRatings]);

  const handleViewRatings = () => {
    setShowRatingId(tailorId);
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
            <p key={`${user._id}-${i}`}>
              {user.name} - ⭐ {user.rating}
            </p>
          ))}
          <button
            className="mt-2 text-sm text-red-600"
            onClick={() => setShowRatingId(null)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default RatingList;
