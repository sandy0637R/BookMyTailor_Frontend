import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import RatingList from "./RatingList";
import FollowerButton from "./FollowerButton";
import Rating from "./Rating";

const TailorCard = ({
  tailor,
  currentUserId,
  followerName,
  showFollowersId,
  setShowFollowersId,
  showFollowingId,
  setShowFollowingId,
  showRatingId,
  setShowRatingId,
  userRateValue,
  avgRating,
}) => {
  const navigate = useNavigate();
  const followers = tailor.tailorDetails?.followers || [];

 const handleViewProfile = () => {
    console.log("Navigating to:", `/tailorprofile/${tailor._id}`);
  navigate(`/tailorprofile/${tailor._id}`);

};


  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
      {/* Followers list */}
      <FollowersList
        tailorId={tailor._id}
        showFollowersId={showFollowersId}
        setShowFollowersId={setShowFollowersId}
        defaultFollowers={followers}
      />

      {/* Following list */}
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

      <img
        src={`http://localhost:5000/${tailor.profileImage}`}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover mt-3"
      />

      <p className="mt-2 font-bold">
        Name: <span className="font-normal">{tailor.name}</span>
      </p>
      <p>Email: {tailor.email}</p>
      <p>Experience: {tailor.tailorDetails?.experience} years</p>

      <div className="mt-3 space-x-2">
        <FollowerButton
          tailorId={tailor._id}
          followers={followers}
          currentUserId={currentUserId}
          followerName={followerName}
        />
        <button
          onClick={handleViewProfile}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          View Profile
        </button>
      </div>

      <Rating
        tailorId={tailor._id}
        currentUserId={currentUserId}
        avgRating={avgRating}
        userRateValue={userRateValue}
      />
    </div>
  );
};

export default TailorCard;
