import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tailors from "./Tailors";
import Cloths from "../containers/Cloths";
import { getClothsRequest } from "../redux/authSlice";
import { fetchTopClothsRequest } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Footer from "../components/Footer";
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
    <><div className="space-y-16  bg-neutral-primary p-4">
      {/* Top 5 Cloths */}

  
      {/* Featured Tailor Section */}
      {featuredTailor && (
        <section className="w-full h-[45vh] bg-neutral-primary rounded-lg shadow-common hover-common flex overflow-hidden relative ">
          <div className="w-1/2 h-full flex justify-center items-center bg-yellow-tertiary rounded-tr-full">
            <img
              src={
                featuredTailor.profileImage
                  ? `https://bookmytailor-backend.onrender.com/${featuredTailor.profileImage.replaceAll("\\", "/")}`
                  : "/placeholder.jpg"
              }
              alt={featuredTailor.name}
              className="rounded-full h-60 w-60 border-8 border-yellow-primary"
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
          </div>
          <div className="w-1/2 p-6 flex flex-col justify-center ">
            <h2 className="text-3xl font-bold text-brown-secondary">{featuredTailor.name}</h2>
            <p className="mt-2 text-lg text-brown-primary">
              <span className="font-semibold">Followers:</span> {featuredTailor.tailorDetails?.followers?.length || 0}
            </p>
            <p className="text-lg text-brown-primary flex items-center">
              <span className="font-semibold mr-1">Rating:</span> {ratings[featuredTailor._id] || 0}{" "}
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
            <p className="text-lg text-brown-primary">
              <span className="font-semibold">Experience:</span> {getExperience(featuredTailor.tailorDetails?.createdAt)}
            </p>
            <button
              onClick={() => navigate(`/tailorprofile/${featuredTailor._id}`)}
              className="mt-4 bg-brown-secondary text-white px-5 py-2 rounded hover:bg-brown-primary hover-common w-xl"
            >
              View Profile
            </button>
          </div>
          <div className="h-60 w-60 absolute right-0 rounded-bl-full bg-yellow-tertiary flex  justify-center items-center">
            <div className="flex flex-col justify-center items-center text-3xl font-bold text-neutral-primary ml-10 mb-10"><span>Top</span>
            <span>Tailor</span></div>
          </div>
        </section>
      )}
   {topCloths.length > 0 && (
    <section className="flex flex-col  h-[35vh] rounded-2xl hover-common justify-center items-center relative overflow-hidden bg-neutral-primary shadow-common">
      <div className="h-65 w-100 absolute bg-brown-secondary left-0 top-0  rounded-br-full"></div>

      <div className="h-65 w-100 absolute bg-brown-secondary right-0 bottom-0 rounded-tl-full"></div>
      <div className="text-2xl font-bold text-brown-secondary mb-2  w-full text-center pb-2">Top Clothes</div>
     <div className="flex space-x-30 overflow-x-auto py-5 px-20 "> {topCloths.map((cloth, index) => {
        const imageUrl =
          cloth.image?.startsWith("http")
            ? cloth.image
            : `https://bookmytailor-backend.onrender.com${cloth.image.replaceAll("\\", "/")}`;

        const hasImage = cloth.image && cloth.image !== "";

        return (
          <div
            key={`${cloth.clothId}-${index}`}
            className="w-40 h-40 flex-shrink-0 rounded-full border-4 border-brown-primary overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100 text-center hover-common z-5"
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
      })}</div>
    </section>
  )}
      {/* Cloths and Tailors */}
      <Cloths />
      <Tailors />

      
    </div>
    <div>{/* Footer */}
      <Footer/></div></>
  );
};

export default Home;
