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
    <div className="bg-neutral-primary rounded-2xl border border-brown-primary/10 p-6 shadow-premium hover-common transition duration-300 w-full max-w-[650px] flex flex-col sm:flex-row gap-6">
      {/* Left: Avatar Frame & Core Badges */}
      <div className="flex flex-col items-center justify-center sm:w-1/3 bg-yellow-tertiary/10 p-4 rounded-xl border border-yellow-tertiary/20">
        <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-gold shadow-md">
          <img
            src={`https://bookmytailor-backend.onrender.com/${tailor.profileImage}`}
            alt={tailor.name}
            className="w-full h-full object-cover rounded-full border-2 border-neutral-primary"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 w-full">
          {/* Followers list */}
          <div className="w-full"><FollowersList
            tailorId={tailor._id}
            showFollowersId={showFollowersId}
            setShowFollowersId={setShowFollowersId}
            defaultFollowers={followers}
          /></div>

          {/* Following list */}
          <div className="w-full"><FollowingList
            userId={tailor._id}
            showFollowingId={showFollowingId}
            setShowFollowingId={setShowFollowingId}
          /></div>

          {/* Rating list */}
          <div className="w-full"><RatingList
            tailorId={tailor._id}
            showRatingId={showRatingId}
            setShowRatingId={setShowRatingId}
          /></div>
        </div>
      </div>

      {/* Right: Info Sheets & Buttons */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-tertiary bg-yellow-primary/50 px-2.5 py-1 rounded-full border border-yellow-tertiary/10">Designer Shop</span>
            <h3 className="text-xl font-bold text-brown-secondary tracking-wide mt-2">{tailor.name}</h3>
            <p className="text-xs font-semibold text-brown-primary/65">{tailor.email}</p>
          </div>

          <div className="py-2 border-y border-brown-primary/10">
            <Rating
              tailorId={tailor._id}
              currentUserId={currentUserId}
              avgRating={avgRating}
              userRateValue={userRateValue}
            />
          </div>
        </div>

        <div className="flex items-center gap-3.5 mt-6 pt-2">
          <div className="flex-1">
            <FollowerButton
              tailorId={tailor._id}
              followers={followers}
              currentUserId={currentUserId}
              followerName={followerName}
            />
          </div>
          <button
            onClick={handleViewProfile}
            className="bg-brown-secondary text-neutral-primary text-[15px] font-bold px-5 py-[8.5px] rounded-lg hover:bg-brown-primary hover-common transition shadow-sm active:scale-95 cursor-pointer"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailorCard;
