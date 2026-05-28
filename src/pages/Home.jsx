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
        <section className="w-full rounded-2xl shadow-premium border border-brown-primary/10 overflow-hidden flex flex-col md:flex-row bg-neutral-primary relative transition duration-300 hover:shadow-custom">
          {/* Left Column (Golden/Bronze Accent Block) */}
          <div className="w-full md:w-5/12 bg-gradient-gold flex justify-center items-center p-8 relative min-h-[300px]">
            <div className="absolute inset-0 bg-[url('/assets/Creative.png')] opacity-10 bg-cover bg-center"></div>
            <div className="relative w-56 h-56 rounded-full p-1.5 bg-neutral-primary shadow-lg border border-yellow-tertiary/25">
              <img
                src={
                  featuredTailor.profileImage
                    ? `https://bookmytailor-backend.onrender.com/${featuredTailor.profileImage.replaceAll("\\", "/")}`
                    : "/placeholder.jpg"
                }
                alt={featuredTailor.name}
                className="rounded-full w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
              />
            </div>
            {/* Absolute badge */}
            <div className="absolute top-4 left-4 bg-brown-tertiary/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest text-yellow-tertiary border border-yellow-tertiary/25 uppercase">
              Featured Tailor
            </div>
          </div>

          {/* Right Column (Details Block) */}
          <div className="w-full md:w-7/12 p-8 flex flex-col justify-center space-y-4 text-brown-secondary">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-tertiary bg-yellow-primary/45 px-2.5 py-1 rounded-full border border-yellow-tertiary/10">Master Craftsman</span>
              <h2 className="text-3xl font-black text-brown-secondary tracking-wide mt-2.5">{featuredTailor.name}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-brown-primary/10 text-sm font-semibold text-brown-primary/75">
              <p className="flex items-center gap-1.5">
                <span className="font-bold text-brown-secondary">Followers:</span> {featuredTailor.tailorDetails?.followers?.length || 0}
              </p>
              <div className="flex items-center">
                <span className="font-bold text-brown-secondary mr-2">Rating:</span>
                <span className="text-yellow-500 font-bold">{ratings[featuredTailor._id] || 0}</span>
                <span className="ml-1.5 flex text-yellow-500 text-xs">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < (ratings[featuredTailor._id] || 0) ? (
                      <FaStar key={`star-${i}`} className="mr-0.5" />
                    ) : (
                      <FaRegStar key={`star-${i}`} className="text-gray-300 mr-0.5" />
                    )
                  )}
                </span>
              </div>
              <p className="col-span-2">
                <span className="font-bold text-brown-secondary">Experience:</span> {getExperience(featuredTailor.tailorDetails?.createdAt)}
              </p>
            </div>

            <button
              onClick={() => navigate(`/tailorprofile/${featuredTailor._id}`)}
              className="bg-brown-secondary text-neutral-primary font-bold px-6 py-3 rounded-lg hover:bg-brown-primary hover-common transition shadow-sm active:scale-95 cursor-pointer max-w-[200px]"
            >
              View Profile
            </button>
          </div>
        </section>
      )}
   {topCloths.length > 0 && (
    <section className="w-full rounded-2xl shadow-premium border border-brown-primary/10 overflow-hidden bg-neutral-primary relative p-8 flex flex-col items-center hover-common transition duration-300">
      <div className="absolute inset-0 bg-yellow-tertiary/5 opacity-40 pointer-events-none"></div>
      <div className="relative z-10 w-full text-center mb-6">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-tertiary bg-yellow-primary/50 px-3 py-1 rounded-full border border-yellow-tertiary/15">Trending Now</span>
        <h2 className="text-2xl font-black text-brown-secondary tracking-widest mt-3 uppercase">Top Clothes</h2>
      </div>

      <div className="relative z-10 flex gap-6 overflow-x-auto w-full py-4 justify-center scrollbar-none">
        {topCloths.map((cloth, index) => {
          const imageUrl =
            cloth.image?.startsWith("http")
              ? cloth.image
              : `https://bookmytailor-backend.onrender.com${cloth.image.replaceAll("\\", "/")}`;

          const hasImage = cloth.image && cloth.image !== "";

          return (
            <div
              key={`${cloth.clothId}-${index}`}
              className="w-28 h-28 flex-shrink-0 rounded-full border-4 border-yellow-tertiary shadow-md overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100 hover:scale-105 active:scale-95 transition duration-200"
              onClick={() => navigate(`/cloths/${cloth.clothId}`)}
              title={cloth.name}
            >
              {hasImage ? (
                <img
                  src={imageUrl}
                  alt={cloth.name || "Cloth Image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"; 
                  }}
                />
              ) : (
                <span className="text-xs font-bold text-brown-tertiary uppercase truncate max-w-[80px]">
                  {cloth.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
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
