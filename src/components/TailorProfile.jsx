import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const TailorProfile = () => {
  const token = useSelector((state) => state.auth.token);

  const [tailors, setTailors] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followerName, setFollowerName] = useState("");
  const [showFollowersId, setShowFollowersId] = useState(null);
  const [followerList, setFollowerList] = useState([]);
  const [ratings, setRatings] = useState({});
  const [userRating, setUserRating] = useState({});
  const [ratingModeId, setRatingModeId] = useState(null);
  const [selectedRating, setSelectedRating] = useState({});
  const [loadingFollowId, setLoadingFollowId] = useState(null);
  const [submittingRatingId, setSubmittingRatingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(tokenData?._id || null);
    } catch (e) {
      setCurrentUserId(null);
    }

    try {
      const profile = JSON.parse(localStorage.getItem("profile"));
      setFollowerName(profile?.name || "");
    } catch (e) {
      setFollowerName("");
    }

    const fetchTailors = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/tailors/alltailors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTailors(data.tailors);
        setUserRating({});
        setRatings({});
        await Promise.all(data.tailors.map((tailor) => fetchRating(tailor._id)));
      } catch (err) {
        console.error("Error fetching tailors", err);
      }
    };

    fetchTailors();
  }, [token]);

  const fetchRating = async (tailorId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/tailors/ratings/${tailorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.averageRating !== undefined) {
        setRatings((prev) => ({ ...prev, [tailorId]: data.averageRating }));
      }
      if (data.userRating !== undefined) {
        setUserRating((prev) => ({ ...prev, [tailorId]: data.userRating }));
      }
    } catch (err) {
      console.error("Error fetching rating", err);
    }
  };

  const handleRateClick = (tailorId) => {
    if (tailorId === currentUserId) {
      alert("You cannot rate yourself.");
      return;
    }
    setRatingModeId(tailorId);
    setSelectedRating((prev) => ({ ...prev, [tailorId]: 0 }));
  };

  const handleStarSelect = (tailorId, star) => {
    setSelectedRating((prev) => ({ ...prev, [tailorId]: star }));
  };

  const submitRating = async (tailorId) => {
    const rating = selectedRating[tailorId];
    if (!rating || rating === 0) {
      alert("Please select a rating");
      return;
    }
    setSubmittingRatingId(tailorId);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/tailors/rate",
        { tailorId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRatings((prev) => ({ ...prev, [tailorId]: data.averageRating }));
      setUserRating((prev) => ({ ...prev, [tailorId]: rating }));
      setSelectedRating((prev) => ({ ...prev, [tailorId]: 0 }));
      setRatingModeId(null);
    } catch (err) {
      console.error("Rating failed", err);
      alert("Failed to submit rating");
    } finally {
      setSubmittingRatingId(null);
    }
  };

  const toggleFollow = async (tailorId, isFollowing) => {
    if (!currentUserId || !followerName) {
      alert("User info missing. Please log in again.");
      return;
    }
    setLoadingFollowId(tailorId);
    const url = isFollowing
      ? `http://localhost:5000/tailors/unfollow/${tailorId}`
      : `http://localhost:5000/tailors/follow/${tailorId}`;

    try {
      await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      setTailors((prev) =>
        prev.map((tailor) =>
          tailor._id === tailorId
            ? {
                ...tailor,
                tailorDetails: {
                  ...tailor.tailorDetails,
                  followers: isFollowing
                    ? tailor.tailorDetails.followers.filter(
                        (f) => f._id.toString() !== currentUserId.toString()
                      )
                    : [...(tailor.tailorDetails.followers || []), { _id: currentUserId, name: followerName }],
                },
              }
            : tailor
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed", err);
      alert("Failed to update follow status");
    } finally {
      setLoadingFollowId(null);
    }
  };

  const isFollowing = (followers) =>
    followers?.some((f) => f._id.toString() === currentUserId?.toString());

  const handleViewFollowers = async (tailorId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/tailors/followers/${tailorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowerList(data.followers);
      setShowFollowersId(tailorId);
    } catch (err) {
      console.error("Error fetching followers", err);
    }
  };

  const renderStars = (rating, clickable = false, onClickStar) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isGold = i <= rating;
      stars.push(
        <span
          key={i}
          onClick={clickable ? () => onClickStar(i) : undefined}
          className={`text-2xl mr-1 select-none ${clickable ? "cursor-pointer" : "cursor-default"} ${
            isGold ? "text-yellow-400" : "text-gray-400"
          }`}
          title={clickable ? `Rate ${i} stars` : undefined}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="p-6 space-y-6">
      {tailors.map((tailor) => {
        const followers = tailor.tailorDetails?.followers || [];
        const userRateValue = userRating[tailor._id];
        const alreadyRated = userRateValue !== undefined && userRateValue > 0;
        const loading = loadingFollowId === tailor._id;
        const submitting = submittingRatingId === tailor._id;
        const avgRating = ratings[tailor._id] || 0;
        const inRatingMode = ratingModeId === tailor._id;
        const selected = selectedRating[tailor._id] || 0;

        return (
          <div
            key={tailor._id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            <p
              className="text-blue-600 cursor-pointer font-semibold"
              onClick={() => handleViewFollowers(tailor._id)}
            >
              Followers: {followers.length}
            </p>

            {showFollowersId === tailor._id && followerList.length > 0 && (
              <div className="bg-gray-100 p-3 mt-2 rounded">
                <h4 className="font-bold mb-2">Followers List:</h4>
                {followerList.map((follower, i) => (
                  <p key={follower._id || i}>{follower.name}</p>
                ))}
                <button className="mt-2 text-sm text-red-600" onClick={() => setShowFollowersId(null)}>
                  Close
                </button>
              </div>
            )}

            <img
              src={`http://localhost:5000/${tailor.profileImage}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mt-3"
            />

            <p className="mt-2 font-bold">Name: <span className="font-normal">{tailor.name}</span></p>
            <p>Email: {tailor.email}</p>
            <p>Experience: {tailor.tailorDetails?.experience} years</p>

            <div className="mt-3 space-x-2">
              <button
                onClick={() => toggleFollow(tailor._id, isFollowing(followers))}
                disabled={loading}
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 disabled:opacity-50"
              >
                {loading ? "Loading..." : isFollowing(followers) ? "Unfollow" : "Follow"}
              </button>

              <button
                onClick={() => setExpandedId(expandedId === tailor._id ? null : tailor._id)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                {expandedId === tailor._id ? "Hide Profile" : "View Profile"}
              </button>
            </div>

            <div className="mt-3">
              <strong>Average Rating: </strong>
              {!inRatingMode ? (
                <>
                  {renderStars(Math.round(avgRating))}
                  <span className="ml-2 text-lg">{avgRating.toFixed(1)}</span>
                  {!alreadyRated && tailor._id !== currentUserId && (
                    <button
                      className="ml-3 bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      onClick={() => handleRateClick(tailor._id)}
                    >
                      Rate
                    </button>
                  )}
                </>
              ) : (
                <>
                  {renderStars(selected, true, (star) => handleStarSelect(tailor._id, star))}
                  <button
                    onClick={() => submitRating(tailor._id)}
                    disabled={submitting}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    onClick={() => {
                      setRatingModeId(null);
                      setSelectedRating((prev) => ({ ...prev, [tailor._id]: 0 }));
                    }}
                    className="ml-2 text-sm text-red-500"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {expandedId === tailor._id && (
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p><strong>Specialization:</strong> {tailor.tailorDetails.specialization.join(", ")}</p>
                <p><strong>Fees:</strong> ₹{tailor.tailorDetails.fees}</p>
                <p><strong>Description:</strong> {tailor.tailorDetails.description || "N/A"}</p>
                <p><strong>Posts:</strong> {tailor.tailorDetails.posts?.length}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TailorProfile;
