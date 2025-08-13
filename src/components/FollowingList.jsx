import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { setSelectedUser } from "../redux/socialSlice"; 

const FollowingList = ({
  userId,
  showFollowingId,
  setShowFollowingId,
  defaultFollowing = [],
}) => {
  const dispatch = useDispatch();
  const rawFollowing = useSelector((state) => state.social.followingList);
  const loadingFollowId = useSelector((s) => s.social.loadingFollowId);

  const followingList = useMemo(() => {
    const list = rawFollowing[userId] || defaultFollowing;
    const unique = Array.from(
      new Map(list.map((user) => [user._id, user])).values()
    );
    return unique;
  }, [rawFollowing, userId, defaultFollowing]);

  useEffect(() => {
    if (!rawFollowing[userId]) {
      dispatch({ type: "FETCH_FOLLOWING_LIST", payload: userId });
    }
  }, [rawFollowing, userId, dispatch]);

  const handleViewFollowing = () => {
    dispatch({ type: "FETCH_FOLLOWING_LIST", payload: userId });
    setShowFollowingId(userId);
  };

  const handleClose = () => {
    setShowFollowingId(null);
    dispatch(setSelectedUser(null)); // ✅ clear selected user
  };

  const formatFollowers = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "m";
    if (num >= 1_000)
      return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "k";
    return num;
  };

  return (
    <>
      <div
        className="flex-col justify-center items-center w-[100px] cursor-pointer "
        onClick={handleViewFollowing}
      >
        <p className="text-brown-primary flex justify-center font-semibold text-[35px] leading-tight ">
          {" "}
          {formatFollowers(followingList.length)}
        </p>
        <p
          className="text-brown-primary cursor-pointer font-semibold flex justify-center text-[20px] leading-tight"
          onClick={handleViewFollowing}
        >
          Following
        </p>
      </div>

      {loadingFollowId === userId && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {showFollowingId === userId && followingList.length > 0 && (
        <div className="bg-gray-100 p-3 mt-2 rounded">
          <h4 className="font-bold mb-2">Following List:</h4>
          {followingList.map((user, i) => (
            <div
              key={`${user._id}-${i}`}
              className="flex items-center justify-between mb-1"
            >
              <p>{user.name}</p>
              <ViewProfileButton userId={user._id} />
            </div>
          ))}
          <button className="mt-2 text-sm text-red-600" onClick={handleClose}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default FollowingList;
