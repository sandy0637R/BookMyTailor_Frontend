import { useDispatch, useSelector } from "react-redux";

const FollowersList = ({ tailorId, showFollowersId, setShowFollowersId, defaultFollowers = [] }) => {
  const dispatch = useDispatch();

  // Use fallback to tailor's default followers if not yet fetched
  const followerList = useSelector((state) =>
    state.social.followerList[tailorId] || defaultFollowers
  );

  const handleViewFollowers = () => {
    dispatch({ type: "FETCH_FOLLOWERS", payload: tailorId });
    setShowFollowersId(tailorId);
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
  <p key={`${follower._id}-${i}`}>{follower.name}</p>
))}

          <button
            className="mt-2 text-sm text-red-600"
            onClick={() => setShowFollowersId(null)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default FollowersList;
