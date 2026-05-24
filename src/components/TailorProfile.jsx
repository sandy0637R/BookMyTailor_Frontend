import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import AllPost from "./post/AllPost";
import FollowerButton from "./FollowerButton";
import Rating from "./Rating";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import RatingList from "./RatingList";
import { setSelectedUser } from "../redux/socialSlice"; // ✅ import

const TailorProfile = () => {
  const { id: tailorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "SET_USER_FROM_TOKEN" });
  }, [dispatch]);

  const posts = useSelector((state) => state.post.posts);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(setSelectedUser(null)); // ✅ clear selected user
    if (tailorId) {
      dispatch({ type: "FETCH_TAILOR", payload: { tailorId } });
    }
  }, [tailorId, dispatch, posts]);

  const currentUserId = useSelector((state) => state.auth.profile?._id);
  const followerName = useSelector((state) => state.auth.profile?.name);
  const allTailors = useSelector((state) => state.social.tailors);
  const tailor = allTailors.find((t) => String(t._id) === String(tailorId));
  const avgRating = useSelector((state) => state.social.ratings[tailorId] || 0);

  const userRateValue = useSelector((state) => {
    const userId = state.auth.profile?._id;
    const ratingMap = state.social.userRating;
    return ratingMap && tailorId in ratingMap ? ratingMap[tailorId] : undefined;
  });

  const [showFollowersId, setShowFollowersId] = useState(null);
  const [showFollowingId, setShowFollowingId] = useState(null);
  const [showRatingId, setShowRatingId] = useState(null);

  const handleRefresh = () => {
    dispatch({ type: "FETCH_TAILOR", payload: { tailorId } });
    dispatch({ type: "FETCH_TAILORS" });
  };

  if (!tailor) {
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        Loading tailor profile...
      </div>
    );
  }

  return (
  <div className="container mx-auto px-4 py-8">
  <button
    onClick={() => navigate(-1)}
    className="mb-6 px-4 py-2 bg-brown-secondary text-neutral-primary rounded-lg hover:bg-brown-primary transition"
  >
    ← Back to Tailors
  </button>

  <div className="bg-neutral-primary rounded-xl shadow-md overflow-hidden">
    <div className="md:flex p-6">
      {/* Profile Picture & Actions */}
      <div className="md:w-1/4 flex flex-col items-center">
        <img
          src={
            tailor.profileImage
              ? `https://bookmytailor-backend.onrender.com/${tailor.profileImage}`
              : "/default-profile.png"
          }
          alt={tailor.name}
          className="w-48 h-48 rounded-full object-cover border-4 border-neutral-primary shadow-lg"
        />
        <div className="mt-4 space-y-4">
         <div className="ml-19 mt-2"> <FollowerButton
            tailorId={tailor._id}
            followers={tailor.tailorDetails?.followers || []}
            currentUserId={currentUserId}
            followerName={followerName}
          /></div>
          <Rating
            tailorId={tailor._id}
            currentUserId={currentUserId}
            avgRating={avgRating}
            userRateValue={userRateValue}
          />
        </div>
        
      </div>

      {/* Profile Details */}
      <div className="md:w-3/4 md:pl-8 mt-6 md:mt-0">
      <div className="flex">
         <div> <h1 className="text-3xl font-bold text-brown-primary">{tailor.name}</h1>
        <p className="text-brown-tertiary mt-2">{tailor.email}</p>
        <div className="mt-6 flex space-x-6">
          <FollowersList
            tailorId={tailor._id}
            showFollowersId={showFollowersId}
            setShowFollowersId={setShowFollowersId}
            defaultFollowers={tailor.tailorDetails?.followers || []}
          />
          <FollowingList
            userId={tailor._id}
            showFollowingId={showFollowingId}
            setShowFollowingId={setShowFollowingId}
            defaultFollowing={tailor.tailorDetails?.following || []}
          />
          <RatingList
            tailorId={tailor._id}
            showRatingId={showRatingId}
            setShowRatingId={setShowRatingId}
          />
        </div></div>
        <div className="ml-8">
  <h3 className="font-semibold text-brown-primary">About</h3>
  <div className="h-35 w-120 overflow-auto p-2 text-sm  rounded bg-yellow-primary">
    <p className="text-brown-tertiary">
      {tailor.tailorDetails?.description || "No description provided."}
    </p>
  </div>
</div>

      </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-brown-primary">
          
          <div>
            <h3 className="font-semibold">Experience</h3>
            <p>{tailor.tailorDetails?.experience || 0} years</p>
          </div>
          <div>
            <h3 className="font-semibold">Specialization</h3>
            <p>
              {tailor.tailorDetails?.specialization?.join(", ") || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Service Fees</h3>
            <p>₹{tailor.tailorDetails?.fees || "Not specified"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Address</h3>
            <p>{tailor.address || "Not specified"}</p>
          </div>
        </div>

      </div>
    </div>

    {/* Posts Section */}
    <div className="px-6 py-4 border-t border-brown-secondary">
      <h2 className="text-xl font-bold mb-4 text-brown-primary">Posts</h2>

      {tailor.tailorDetails?.posts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AllPost posts={tailor.tailorDetails.posts} onRefresh={handleRefresh} />
        </div>
      ) : (
        <p className="text-brown-tertiary text-center py-10">
          No posts yet. Create your first post to showcase your work!
        </p>
      )}
    </div>
  </div>
</div>

  );
};

export default TailorProfile;
