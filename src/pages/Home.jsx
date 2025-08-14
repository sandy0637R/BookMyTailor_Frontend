import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tailors from "./Tailors";
import Cloths from "../containers/Cloths";
import { getClothsRequest } from "../redux/authSlice";
import { fetchTopClothsRequest } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tailors = useSelector((state) => state.social.tailors || []);
  const ratings = useSelector((state) => state.social.ratings || {});
  const cloths = useSelector((state) => state.auth.cloths || []);
  const topCloths = useSelector((state) => state.order.topCloths || []);

  const loadingCloths = useSelector((state) => state.auth.loading);
  const loadingTailors = useSelector((state) => state.social.loading);

  useEffect(() => {
    dispatch(getClothsRequest());
    dispatch(fetchTopClothsRequest());
  }, [dispatch]);

  const featuredTailor = useMemo(() => {
    if (!tailors.length) return null;
    return [...tailors].sort(
      (a, b) =>
        (b.tailorDetails?.followers?.length || 0) -
        (a.tailorDetails?.followers?.length || 0)
    )[0];
  }, [tailors]);

  const getExperience = (createdAt) => {
    if (!createdAt) return 0;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""}`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  const isLoading =
    (loadingCloths && cloths.length === 0) ||
    (loadingTailors && tailors.length === 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-16 p-4">
      {/* Top 5 Cloths */}
     {topCloths.length > 0 && (
    <section className="flex space-x-4 overflow-x-auto py-2">
      {topCloths.map((cloth, index) => {
        const imageUrl =
          cloth.image?.startsWith("http")
            ? cloth.image
            : `http://localhost:5000${cloth.image.replaceAll("\\", "/")}`;

        const hasImage = cloth.image && cloth.image !== "";

        return (
          <div
            key={`${cloth.clothId}-${index}`}
            className="w-20 h-20 flex-shrink-0 rounded-full border-2 border-gray-300 overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100 text-center p-1"
            onClick={() => navigate(`/cloths/${cloth.clothId}`)}
          >
            {hasImage ? (
              <img
                src={imageUrl}
                alt={cloth.name || "Cloth Image"}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none"; 
                }}
              />
            ) : (
              <span className="text-sm font-medium text-gray-700">
                {cloth.name}
              </span>
            )}
          </div>
        );
      })}
    </section>
  )}

      {/* Featured Tailor Section */}
      {featuredTailor && (
        <section className="w-full h-[35vh] bg-gray-100 rounded-lg shadow flex overflow-hidden">
          <div className="w-1/2 h-full">
            <img
              src={
                featuredTailor.profileImage
                  ? `http://localhost:5000/${featuredTailor.profileImage.replaceAll("\\", "/")}`
                  : "/placeholder.jpg"
              }
              alt={featuredTailor.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
          </div>
          <div className="w-1/2 p-6 flex flex-col justify-center">
            <h2 className="text-3xl font-bold">{featuredTailor.name}</h2>
            <p className="mt-2 text-lg text-gray-600">
              Followers: {featuredTailor.tailorDetails?.followers?.length || 0}
            </p>
            <p className="text-lg text-gray-600 flex items-center">
              Rating: {ratings[featuredTailor._id] || 0}{" "}
              <span className="ml-2 flex">
                {Array.from({ length: 5 }).map((_, i) =>
                  i < (ratings[featuredTailor._id] || 0) ? (
                    <FaStar key={`star-${i}`} className="text-yellow-500 mr-1" />
                  ) : (
                    <FaRegStar key={`star-${i}`} className="text-gray-300 mr-1" />
                  )
                )}
              </span>
            </p>
            <p className="text-lg text-gray-600">
              Experience: {getExperience(featuredTailor.tailorDetails?.createdAt)}
            </p>
            <button
              onClick={() => navigate(`/tailorprofile/${featuredTailor._id}`)}
              className="mt-4 bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
            >
              View Profile
            </button>
          </div>
        </section>
      )}

      {/* Cloths and Tailors */}
      <Cloths />
      <Tailors />
    </div>
  );
};

export default Home;
