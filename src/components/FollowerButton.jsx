import { useDispatch, useSelector } from "react-redux";

const FollowerButton = ({
  tailorId,
  followers,
  currentUserId,
  followerName,
}) => {
  const dispatch = useDispatch();
  const loadingFollowId = useSelector((state) => state.social.loadingFollowId);
  const isFollowing = followers?.some(
    (f) => f._id.toString() === currentUserId?.toString()
  );
  const loading = loadingFollowId === tailorId;

  const toggleFollow = async () => {
    if (!currentUserId || !followerName) {
      await alert("User info missing. Please log in again.");
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
      className="bg-brown-primary text-neutral-primary text-[16px] px-10 py-[6px] rounded hover:bg-brown-secondary disabled:opacity-50 hover-common"
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowerButton;
