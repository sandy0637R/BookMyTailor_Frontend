import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Rating = ({
  tailorId,
  currentUserId,
  avgRating,
  userRateValue,
}) => {
  const dispatch = useDispatch();
  const submittingRatingId = useSelector((state) => state.social.submittingRatingId);
  const [ratingModeId, setRatingModeId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const alreadyRated = userRateValue !== undefined && userRateValue > 0;
  const inRatingMode = ratingModeId === tailorId;
  const submitting = submittingRatingId === tailorId;

  const handleRateClick = () => {
    if (tailorId === currentUserId) {
      alert("You cannot rate yourself.");
      return;
    }
    setRatingModeId(tailorId);
    setSelectedRating(0);
  };

  const renderStars = (rating, clickable = false, onClickStar) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isGold = i <= rating;
      stars.push(
        <span
          key={i}
          onClick={clickable ? () => onClickStar(i) : undefined}
          className={`text-2xl mr-1 select-none ${clickable ? "cursor-pointer" : "cursor-default"} ${
            isGold ? "text-yellow-400" : "text-gray-400"
          }`}
          title={clickable ? `Rate ${i} stars` : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const submitRating = () => {
    if (!selectedRating || selectedRating === 0) {
      alert("Please select a rating");
      return;
    }
    dispatch({ type: "SUBMIT_RATING", payload: { tailorId, rating: selectedRating } });
    setRatingModeId(null);
    setSelectedRating(0);
  };

  return (
    <div className="mt-3">
      <strong>Average Rating: </strong>
      {!inRatingMode ? (
        <>
          {renderStars(Math.round(avgRating))}
          <span className="ml-2 text-lg">{avgRating.toFixed(1)}</span>
          {!alreadyRated && tailorId !== currentUserId && (
            <button
              className="ml-3 bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
              onClick={handleRateClick}
            >
              Rate
            </button>
          )}
        </>
      ) : (
        <>
          {renderStars(selectedRating, true, setSelectedRating)}
          <button
            onClick={submitRating}
            disabled={submitting}
            className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={() => {
              setRatingModeId(null);
              setSelectedRating(0);
            }}
            className="ml-2 text-sm text-red-500"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default Rating;
