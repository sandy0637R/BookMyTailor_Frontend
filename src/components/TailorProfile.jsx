import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./post/PostCard";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import RatingList from "./RatingList";

const TailorProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);
  const posts = useSelector((state) => state.post.posts);
  const userId = useSelector((state) => state.post.userId);
  const ratings = useSelector((state) => state.social.ratings);
  const userRating = useSelector((state) => state.social.userRating);
  const followerList = useSelector((state) => state.social.followerList);
  const followingList = useSelector((state) => state.social.followingList);

  useEffect(() => {
    dispatch({ type: "FETCH_POSTS" });
    dispatch({ type: "SET_USER_FROM_TOKEN" });
    if (profile?._id) {
      dispatch({ type: "FETCH_FOLLOWERS", payload: profile._id });
      dispatch({ type: "FETCH_RATED_USERS", payload: profile._id });
      dispatch({ type: "FETCH_FOLLOWING_LIST", payload: profile._id });
    }
  }, [dispatch, profile?._id]);

  if (!profile) return <p className="text-center py-10">Loading profile...</p>;

  const userRate = userRating[profile._id] || "Not rated";
  const avgRate = ratings[profile._id]?.toFixed(1) || "No rating";
  const followers = followerList[profile._id] || [];
  const following = followingList[profile._id] || [];

  const userPosts = posts.filter(
    (p) => p.postedBy?._id === profile._id
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* 1. Profile Info */}
      <div className="text-center space-y-2">
        <img
          src={profile.profileImage}
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto border"
        />
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <p className="text-gray-600">{profile.email}</p>
        <p className="text-sm text-gray-500">Role: {profile.roles.join(", ")}</p>
      </div>

      {/* 2. Followers & Following */}
      <div className="flex flex-col md:flex-row justify-around items-start gap-6">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Followers ({followers.length})</h3>
          <FollowersList tailorId={profile._id} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Following ({following.length})</h3>
          <FollowingList userId={profile._id} />
        </div>
      </div>

      {/* 3. Rating */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Rating</h3>
        <p className="mb-1">Average Rating: ⭐ {avgRate}</p>
        <p>Your Rating: {userRate === "Not rated" ? userRate : `⭐ ${userRate}`}</p>
        <RatingList tailorId={profile._id} />
      </div>

      {/* 4. Posts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Posts ({userPosts.length})</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default TailorProfile;
