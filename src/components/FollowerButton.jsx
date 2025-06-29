import { useDispatch, useSelector } from "react-redux";

const FollowerButton = ({ tailorId, followers, currentUserId, followerName }) => {
  const dispatch = useDispatch();
  const loadingFollowId = useSelector((state) => state.social.loadingFollowId);
  const isFollowing = followers?.some(f => f._id.toString() === currentUserId?.toString());
  const loading = loadingFollowId === tailorId;

  const toggleFollow = () => {
    if (!currentUserId || !followerName) {
      alert("User info missing. Please log in again.");
      return;
    }

    dispatch({
      type: "TOGGLE_FOLLOW",
      payload: { tailorId, isFollowing, currentUserId, followerName },
    });
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 disabled:opacity-50"
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowerButton;
