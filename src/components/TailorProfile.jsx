import React, { useState } from "react";
import { useSelector } from "react-redux";
import AllTailors from "./AllTailors";
import FollowerButton from "./FollowerButton";
import FollowersList from "./FollowersList";
import Rating from "./Rating";
import FollowingList from "./FollowingList";
import RatingList from "./RatingList";

const TailorProfile = () => {
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
        const followers = tailor.tailorDetails?.followers || [];
        const userRateValue = userRating[tailor._id];
        const avgRating = ratings[tailor._id] || 0;

        return (
          <div
            key={tailor._id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            {/* Followers count and list */}
            <FollowersList
              tailorId={tailor._id}
              showFollowersId={showFollowersId}
              setShowFollowersId={setShowFollowersId}
              defaultFollowers={tailor.tailorDetails?.followers || []}
            />

            {/* Following count and list */}
            <FollowingList
              userId={tailor._id}
              showFollowingId={showFollowingId}
              setShowFollowingId={setShowFollowingId}
            />

            {/* Rating list */}
            <RatingList
              tailorId={tailor._id}
              showRatingId={showRatingId}
              setShowRatingId={setShowRatingId}
            />

            {/* Profile Image */}
            <img
              src={`http://localhost:5000/${tailor.profileImage}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mt-3"
            />

            <p className="mt-2 font-bold">Name: <span className="font-normal">{tailor.name}</span></p>
            <p>Email: {tailor.email}</p>
            <p>Experience: {tailor.tailorDetails?.experience} years</p>

            {/* Buttons: Follow / Unfollow + View Profile */}
            <div className="mt-3 space-x-2">
              <FollowerButton
                tailorId={tailor._id}
                followers={followers}
                currentUserId={currentUserId}
                followerName={followerName}
              />
              <button
                onClick={() => setExpandedId(expandedId === tailor._id ? null : tailor._id)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                {expandedId === tailor._id ? "Hide Profile" : "View Profile"}
              </button>
            </div>

            {/* Rating stars, value, button */}
            <Rating
              tailorId={tailor._id}
              currentUserId={currentUserId}
              avgRating={avgRating}
              userRateValue={userRateValue}
            />

            {/* Expanded details */}
            {expandedId === tailor._id && (
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p><strong>Specialization:</strong> {tailor.tailorDetails.specialization.join(", ")}</p>
                <p><strong>Fees:</strong> ₹{tailor.tailorDetails.fees}</p>
                <p><strong>Description:</strong> {tailor.tailorDetails.description || "N/A"}</p>
                <p><strong>Posts:</strong> {tailor.tailorDetails.posts?.length}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TailorProfile;
