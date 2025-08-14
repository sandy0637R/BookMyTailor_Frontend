import React, { useState } from "react";
import { useSelector } from "react-redux";
import AllTailors from "../containers/AllTailors";
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

  // ✅ Pagination state
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const nextPage = () => {
    if (startIndex + itemsPerPage < tailors.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prevPage = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <AllTailors
        token={token}
        setCurrentUserId={setCurrentUserId}
        setFollowerName={setFollowerName}
      />

     <div className="relative">
  <button
    onClick={prevPage}
    disabled={startIndex === 0}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
  >
    ◀
  </button>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
    {tailors.slice(startIndex, startIndex + itemsPerPage).map((tailor) => {
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

  <button
    onClick={nextPage}
    disabled={startIndex + itemsPerPage >= tailors.length}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
  >
    ▶
  </button>
</div>

    </div>
  );
};

export default Tailors;
