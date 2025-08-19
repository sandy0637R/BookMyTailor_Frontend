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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
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
        className="flex-col justify-center items-center w-[100px] cursor-pointer"
        onClick={handleViewFollowing}
      >
        <p className="text-brown-primary flex justify-center font-semibold text-[35px] leading-tight">
          {formatFollowers(followingList.length)}
        </p>
        <p
          className="text-brown-primary cursor-pointer font-semibold flex justify-center text-[20px] leading-tight"
        >
          Following
        </p>
      </div>

      {loadingFollowId === userId && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {showFollowingId === userId && followingList.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-yellow-primary text-brown-primary rounded-lg p-4 w-[410px] h-[400px] shadow-lg flex flex-col">
            <h4 className="font-bold mb-2 text-center">Following List</h4>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 border-t-2 border-b-2 py-2">
              {followingList.map((user, i) => (
                <div
                  key={`${user._id}-${i}`}
                  className="flex items-center justify-between mb-1 py-2 px-2 mx-0.5 bg-yellow-100 rounded-lg hover-common"
                >
                  <p>{user.name}</p>
                  <ViewProfileButton userId={user._id} />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              className="mt-3  text-white bg-red-500 px-4 py-[6px] rounded hover:bg-red-600 self-end"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowingList;
