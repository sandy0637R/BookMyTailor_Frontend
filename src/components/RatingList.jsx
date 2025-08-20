import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { setSelectedUser } from "../redux/socialSlice";

const RatingList = ({
  tailorId,
  showRatingId,
  setShowRatingId,
  defaultRatings = [],
}) => {
  const dispatch = useDispatch();
  const ratingList = useSelector((state) => state.social.ratedUsersList);

  useEffect(() => {
    if (!ratingList[tailorId]) {
      dispatch({ type: "FETCH_RATED_USERS", payload: tailorId });
    }
  }, [dispatch, ratingList, tailorId]);

  const ratings = useMemo(
    () => ratingList?.[tailorId] || defaultRatings,
    [ratingList, tailorId, defaultRatings]
  );

  const handleViewRatings = () => {
    setShowRatingId(tailorId);
  };

  const handleClose = () => {
    setShowRatingId(null);
    dispatch(setSelectedUser(null)); // clear stale user
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* Trigger */}
      <div
        className="flex-col justify-center items-center w-[100px] cursor-pointer"
        onClick={handleViewRatings}
      >
        <p className="text-yellow-premium flex justify-center font-semibold text-[35px] leading-tight">
          {ratings.length}
        </p>
        <p className="text-yellow-premium cursor-pointer font-semibold flex justify-center text-[20px] leading-tight">
          Ratings
        </p>
      </div>

      {/* Modal */}
      {showRatingId === tailorId && ratings.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-yellow-primary text-brown-primary rounded-lg p-4 w-[410px] h-[400px] shadow-lg flex flex-col">
            <h4 className="font-bold mb-2 text-center">Rated By Users</h4>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 border-t-2 border-b-2 py-2">
              {ratings.map((user, i) => (
                <div
                  key={`${user._id}-${i}`}
                  className="flex items-center justify-between mb-1 py-2 px-2 mx-0.5 bg-yellow-100 rounded-lg hover-common"
                >
                  <p>
                    {user.name} - ⭐ {user.rating}
                  </p>
                  <ViewProfileButton userId={user._id} />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              className="mt-3 text-sm text-white bg-red-500 px-4 py-1 rounded hover:bg-red-600 self-end"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingList;
