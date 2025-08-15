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
    <div className="bg-neutral-primary  rounded-xl  pr-5 pb-5   w-[600px] shadow-common">
     <div className="flex items-center ">
       <div className="bg-yellow-tertiary mr-5 px-5 py-5  rounded-tl-xl rounded-br-[100px]">
        <img
         src={`http://localhost:5000/${tailor.profileImage}`}
         alt="Profile"
         className="w-45 h-45 border-4 border-neutral-primary rounded-full object-cover  shadow-custom  "
       />
       </div>
      <div className="flex">
       {/* Followers list */}
      <div className="mr-5"><FollowersList
        tailorId={tailor._id}
        showFollowersId={showFollowersId}
        setShowFollowersId={setShowFollowersId}
        defaultFollowers={followers}
      /></div>

      {/* Following list */}
      <div className="mr-5"><FollowingList
        userId={tailor._id}
        showFollowingId={showFollowingId}
        setShowFollowingId={setShowFollowingId}
      /></div>

      {/* Rating list */}
      <div className=""><RatingList
        tailorId={tailor._id}
        showRatingId={showRatingId}
        setShowRatingId={setShowRatingId}
      /></div>
     </div>

     </div>

      <div className="pl-5"><div className="mt-7">
        <p className="mt-2 font-semibold text-[16.5px] text-brown-secondary">
        Name: <span className="font-normal text-brown-tertiary">{tailor.name}</span>
      </p>
      <p className="mt-2 font-semibold text-[16.5px] text-brown-secondary">Email: <span className="font-normal text-brown-tertiary">{tailor.email}</span></p>
      </div>

      <div className="my-2 "><Rating
        tailorId={tailor._id}
        currentUserId={currentUserId}
        avgRating={avgRating}
        userRateValue={userRateValue}
      /></div>

      <div className="mt-6 space-x-2">
        <FollowerButton
          tailorId={tailor._id}
          followers={followers}
          currentUserId={currentUserId}
          followerName={followerName}
        />
        <button
          onClick={handleViewProfile}
          className="bg-brown-secondary text-neutral-primary text-[16px] px-4 py-[6px] rounded hover:bg-brown-primary hover-common"
        >
          View Profile
        </button>
      </div>

      </div>
    </div>
  );
};

export default TailorCard;
