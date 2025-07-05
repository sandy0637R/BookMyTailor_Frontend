import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import FollowingList from "../components/FollowingList";
import { clearSelectedUser } from "../redux/socialSlice"; // ✅ Import clear action

const CustomerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.social.selectedUser);

  useEffect(() => {
    if (id) {
      dispatch({ type: "FETCH_USER_BY_ID", payload: { userId: id } });
    }

    return () => {
      dispatch(clearSelectedUser()); // ✅ Clear user on unmount or ID change
    };
  }, [id, dispatch]);

  if (!user) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.profileImage ? `http://localhost:5000/${user.profileImage}` : "/default-profile.png"}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.address}</p>
          </div>
        </div>

        <div className="mt-6">
          <FollowingList
            userId={user._id}
            showFollowingId={user._id}
            setShowFollowingId={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
