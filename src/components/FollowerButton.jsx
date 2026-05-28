import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FollowerButton = ({
  tailorId,
  followers,
  currentUserId,
  followerName,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loadingFollowId = useSelector((state) => state.social.loadingFollowId);
  const isFollowing = followers?.some(
    (f) => f._id.toString() === currentUserId?.toString()
  );
  const loading = loadingFollowId === tailorId;

  const toggleFollow = async () => {
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to follow a tailor. Would you like to log in now?")) {
        navigate("/login");
      }
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
