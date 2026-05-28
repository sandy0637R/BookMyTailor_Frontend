import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Rating = ({
  tailorId,
  currentUserId,
  avgRating,
  userRateValue,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const submittingRatingId = useSelector((state) => state.social.submittingRatingId);
  const [ratingModeId, setRatingModeId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  
  const alreadyRated = userRateValue && userRateValue > 0;
  const inRatingMode = ratingModeId === tailorId;
  const submitting = submittingRatingId === tailorId;

  const handleRateClick = async () => {
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to rate a tailor. Would you like to log in now?")) {
        navigate("/login");
      }
      return;
    }

  const proceed = await new Promise((resolve) => {
    if (tailorId === currentUserId) {
      resolve(window.alert("You cannot rate yourself."));
    } else {
      resolve(true);
    }
  });
  if (!proceed) return;

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

  const submitRating = async () => {
  const proceed = await new Promise((resolve) => {
    if (!selectedRating || selectedRating === 0) {
      resolve(window.alert("Please select a rating"));
    } else {
      resolve(true);
    }
  });
  if (!proceed) return;

  dispatch({ type: "SUBMIT_RATING", payload: { tailorId, rating: selectedRating } });
  setRatingModeId(null);
  setSelectedRating(0);
};
  return (
    <div className="mt-3 text-brown-secondary">
      <strong >Average Rating: </strong>
      {!inRatingMode ? (
        <>
          {renderStars(Math.round(avgRating))}
          <span className="ml-2 text-lg">{avgRating.toFixed(1)}</span>
          
          {/* ✅ Only show if user has NOT rated and it's not their own profile */}
          {!alreadyRated && tailorId !== currentUserId && (
            <button
              className="ml-3 bg-yellow-premium text-white px-2 py-1 rounded hover:bg-yellow-tertiary hover-common"
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
            className="ml-2 bg-yellow-premium text-white px-2 py-1 rounded hover:bg-yellow-tertiary hover-common disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={() => {
              setRatingModeId(null);
              setSelectedRating(0);
            }}
            className="ml-2 text-sm text-danger-primary hover:text-danger-secondary"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default Rating;
