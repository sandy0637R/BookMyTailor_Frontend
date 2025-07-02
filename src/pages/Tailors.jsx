import React, { useState } from "react";
import { useSelector } from "react-redux";
import AllTailors from "../components/AllTailors";
import TailorCard from "../components/TailorCard";

const Tailors = () => {
  const token = useSelector((state) => state.auth.token);
  const tailors = useSelector((state) => state.social.tailors);
  const ratings = useSelector((state) => state.social.ratings);
  const userRating = useSelector((state) => state.social.userRating);

  const [expandedId, setExpandedId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followerName, setFollowerName] = useState("");
  const [showFollowersId, setShowFollowersId] = useState(null);
  const [showFollowingId, setShowFollowingId] = useState(null);
  const [showRatingId, setShowRatingId] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <AllTailors
        token={token}
        setCurrentUserId={setCurrentUserId}
        setFollowerName={setFollowerName}
      />

      {tailors.map((tailor) => {
        const userRateValue = userRating[tailor._id];
        const avgRating = ratings[tailor._id] || 0;

        return (
          <TailorCard
            key={tailor._id}
            tailor={tailor}
            currentUserId={currentUserId}
            setCurrentUserId={setCurrentUserId}
            followerName={followerName}
            setFollowerName={setFollowerName}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            showFollowersId={showFollowersId}
            setShowFollowersId={setShowFollowersId}
            showFollowingId={showFollowingId}
            setShowFollowingId={setShowFollowingId}
            showRatingId={showRatingId}
            setShowRatingId={setShowRatingId}
            userRateValue={userRateValue}
            avgRating={avgRating}
          />
        );
      })}
    </div>
  );
};

export default Tailors;
