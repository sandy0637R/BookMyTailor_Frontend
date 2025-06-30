import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FollowingList = ({ userId, showFollowingId, setShowFollowingId, defaultFollowing = [] }) => {
  const dispatch = useDispatch();
  const rawFollowing = useSelector((state) => state.social.followingList);
  const loadingFollowId = useSelector((s) => s.social.loadingFollowId);

  // ✅ Remove duplicates
  const followingList = useMemo(() => {
    const list = rawFollowing[userId] || defaultFollowing;
    const unique = Array.from(new Map(list.map(user => [user._id, user])).values());
    return unique;
  }, [rawFollowing, userId, defaultFollowing]);

  // ✅ Fetch once on mount if not already fetched
  useEffect(() => {
    if (!rawFollowing[userId]) {
      dispatch({ type: "FETCH_FOLLOWING_LIST", payload: userId });
    }
  }, [rawFollowing, userId, dispatch]);

  // ✅ Show names only when clicked
  const handleViewFollowing = () => {
    dispatch({ type: "FETCH_FOLLOWING_LIST", payload: userId });
    setShowFollowingId(userId);
  };

  return (
    <>
      <p className="text-blue-600 cursor-pointer font-semibold" onClick={handleViewFollowing}>
        Following: {followingList.length}
      </p>

      {loadingFollowId === userId && <p className="text-sm text-gray-500">Loading...</p>}

      {showFollowingId === userId && followingList.length > 0 && (
        <div className="bg-gray-100 p-3 mt-2 rounded">
          <h4 className="font-bold mb-2">Following List:</h4>
          {followingList.map((user, i) => (
            <p key={`${user._id}-${i}`}>{user.name}</p>
          ))}
          <button className="mt-2 text-sm text-red-600" onClick={() => setShowFollowingId(null)}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default FollowingList;
