import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import FollowingList from "../components/FollowingList";
import { setSelectedUser } from "../redux/socialSlice";

const CustomerProfile = () => {
  const { id: customerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ clear previous user & fetch fresh one
  useEffect(() => {
    dispatch(setSelectedUser(null));
    if (customerId) {
      dispatch({ type: "FETCH_USER_BY_ID", payload: { userId: customerId } });
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const user = useSelector((state) => state.social.selectedUser);

  const [showFollowingId, setShowFollowingId] = useState(null);

  if (!user) {
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        Loading customer profile...
      </div>
    );
  }

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
            src={
              user.profileImage
                ? `http://localhost:5000/${user.profileImage}`
                : "/default-profile.png"
            }
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border"
          />
          <div className="flex justify-center items-center ">
            <div className="m-10">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.address || "N/A"}</p>
          </div>
        </div>

        <div className="m-10">
          <FollowingList
            userId={user._id}
            showFollowingId={showFollowingId}
            setShowFollowingId={setShowFollowingId}
            defaultFollowing={user.following || []}
          />
        </div>
          </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
