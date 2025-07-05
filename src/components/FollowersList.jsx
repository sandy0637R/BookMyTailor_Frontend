import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { clearSelectedUser } from "../redux/socialSlice"; // ✅ Import

const FollowersList = ({ tailorId, showFollowersId, setShowFollowersId, defaultFollowers = [] }) => {
  const dispatch = useDispatch();

  const followerList = useSelector((state) =>
    state.social.followerList[tailorId] || defaultFollowers
  );

  const handleViewFollowers = () => {
    dispatch(clearSelectedUser()); // ✅ Reset previous selected user
    dispatch({ type: "FETCH_FOLLOWERS", payload: tailorId });
    setShowFollowersId(tailorId);
  };

  const handleClose = () => {
    setShowFollowersId(null);
    dispatch(clearSelectedUser()); // ✅ Reset on close
  };

  return (
    <>
      <p
        className="text-blue-600 cursor-pointer font-semibold"
        onClick={handleViewFollowers}
      >
        Followers: {followerList.length}
      </p>

      {showFollowersId === tailorId && followerList.length > 0 && (
        <div className="bg-gray-100 p-3 mt-2 rounded">
          <h4 className="font-bold mb-2">Followers List:</h4>
          {followerList.map((follower, i) => (
            <div key={`${follower._id}-${i}`} className="flex items-center justify-between mb-1">
              <p>{follower.name}</p>
              <ViewProfileButton userId={follower._id} />
            </div>
          ))}

          <button
            className="mt-2 text-sm text-red-600"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default FollowersList;
