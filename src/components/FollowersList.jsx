import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { clearSelectedUser } from "../redux/socialSlice";

const FollowersList = ({
  tailorId,
  showFollowersId,
  setShowFollowersId,
  defaultFollowers = [],
}) => {
  const dispatch = useDispatch();

  const followerList = useSelector(
    (state) => state.social.followerList[tailorId] || defaultFollowers
  );

  const handleViewFollowers = () => {
    dispatch(clearSelectedUser());
    dispatch({ type: "FETCH_FOLLOWERS", payload: tailorId });
    setShowFollowersId(tailorId);
  };

  const handleClose = () => {
    setShowFollowersId(null);
    dispatch(clearSelectedUser());
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div className="flex-col justify-center items-center w-[100px]">
        <p
          className="text-brown-primary flex justify-center font-semibold text-[35px] leading-tight cursor-pointer"
          onClick={handleViewFollowers}
        >
          {followerList.length}
        </p>
        <p
          className="text-brown-primary cursor-pointer font-semibold flex justify-center text-[20px] leading-tight"
          onClick={handleViewFollowers}
        >
          Followers
        </p>
      </div>

      {showFollowersId === tailorId && followerList.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 w-[400px] h-[400px] shadow-lg flex flex-col">
            <h4 className="font-bold mb-2">Followers List</h4>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 border-t border-b py-2">
              {followerList.map((follower, i) => (
                <div
                  key={`${follower._id}-${i}`}
                  className="flex items-center justify-between mb-1"
                >
                  <p>{follower.name}</p>
                  <ViewProfileButton userId={follower._id} />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              className="mt-3 text-sm text-white bg-red-500 px-4 py-1 rounded hover:bg-red-600 self-end"
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

export default FollowersList;
