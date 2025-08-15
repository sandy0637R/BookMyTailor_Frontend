import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import AllTailors from "../containers/AllTailors";
import TailorCard from "../components/TailorCard";
import { IoMdRefresh } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const Tailors = () => {
  const token = useSelector((state) => state.auth.token);
  const tailors = useSelector((state) => state.social.tailors);
  const ratings = useSelector((state) => state.social.ratings);
  const userRating = useSelector((state) => state.social.userRating);

  const [expandedId, setExpandedId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [followerName, setFollowerName] = useState("");
  const [showFollowersId, setShowFollowersId] = useState(null);
  const [showFollowingId, setShowFollowingId] = useState(null);
  const [showRatingId, setShowRatingId] = useState(null);

  // Pagination
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 2;

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Shuffling state
  const [shuffledTailors, setShuffledTailors] = useState([]);

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
    setStartIndex(0);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSortConfig({ key: "", direction: "" });
    setStartIndex(0);
    shuffleTailors(); // Shuffle only when refreshing
  };

  const shuffleTailors = () => {
    setShuffledTailors([...tailors].sort(() => Math.random() - 0.5));
  };

  const filteredAndSortedTailors = useMemo(() => {
    let baseList = shuffledTailors.length > 0 ? shuffledTailors : tailors;

    let filtered = baseList.filter((tailor) => {
      const query = searchQuery.trim().toLowerCase();
      return (
        tailor.name?.toLowerCase().includes(query) ||
        tailor.email?.toLowerCase().includes(query)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "fees":
            aValue = a.tailorDetails?.fees || 0;
            bValue = b.tailorDetails?.fees || 0;
            break;
          case "rating":
            aValue = a.tailorDetails?.averageRating || 0;
            bValue = b.tailorDetails?.averageRating || 0;
            break;
          case "followers":
            aValue = a.tailorDetails?.followers?.length || 0;
            bValue = b.tailorDetails?.followers?.length || 0;
            break;
          default:
            return 0;
        }

        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      });
    }

    return filtered;
  }, [tailors, shuffledTailors, searchQuery, sortConfig]);

  const nextPage = () => {
    if (startIndex + itemsPerPage < filteredAndSortedTailors.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prevPage = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <div className="p-6 space-y-6 shadow-common rounded-lg bg-neutral-primary ">
      <h2 className="text-3xl font-bold text-center mb-10 mt-5 text-brown-secondary">Tailors</h2>
      <AllTailors
        token={token}
        setCurrentUserId={setCurrentUserId}
        setFollowerName={setFollowerName}
      />

      {/* Search & Sort */}
     {/* Search & Sort */}
<div className="flex flex-wrap  items-center relative ">
  <label htmlFor="searchInput" className=" text-brown-primary rounded-tl-xl rounded-bl-xl pl-4 py-4 text-[21px] border-y-2 border-l-2 bg-yellow-primary">
      <FaSearch />
    </label>
  <div className="relative">
    <input
    id="searchInput"
      type="text"
      placeholder="Search here..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setStartIndex(0);
      }}
      className="px-4 py-4 text-[14px] text-brown-primary border-y-2 border-r-2 bg-yellow-primary w-64  focus:outline-none "
    />

    {/* No search results dropdown */}
    {searchQuery.trim() !== "" && filteredAndSortedTailors.length === 0 && (
      <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow text-gray-600 text-sm py-2 px-3">
        No search found
      </div>
    )}
  </div>

  {/* Fees Sort */}
  <select
    value={sortConfig.key === "fees" ? sortConfig.direction : ""}
    onChange={(e) => handleSortChange("fees", e.target.value)}
    className="px-4 py-4 border-y-2 border-r-2 w-[150px] border-brown-primary font-semibold bg-yellow-primary text-brown-primary hover-common hover:bg-yellow-tertiary hover:text-neutral-primary "
  >
    <option value=""> Fees</option>
    <option value="desc">High to Low</option>
    <option value="asc">Low to High</option>
  </select>

  {/* Rating Sort */}
  <select
    value={sortConfig.key === "rating" ? sortConfig.direction : ""}
    onChange={(e) => handleSortChange("rating", e.target.value)}
    className="px-4 py-4 border-y-2 border-r-2 w-[150px] border-brown-primary font-semibold bg-yellow-primary text-brown-primary hover-common hover:bg-yellow-tertiary hover:text-neutral-primary "
  >
    <option value=""> Rating</option>
    <option value="desc">High to Low</option>
    <option value="asc">Low to High</option>
  </select>

  {/* Followers Sort */}
  <select
    value={sortConfig.key === "followers" ? sortConfig.direction : ""}
    onChange={(e) => handleSortChange("followers", e.target.value)}
    className="px-4 py-4 border-y-2 border-r-2 w-[150px] border-brown-primary font-semibold bg-yellow-primary text-brown-primary hover-common hover:bg-yellow-tertiary hover:text-neutral-primary "
  >
    <option value=""> Followers</option>
    <option value="desc">High to Low</option>
    <option value="asc">Low to High</option>
  </select>

  {/* Refresh Button */}
  <button
    onClick={handleReset}
    className="px-3 py-3 text-[29px] text-brown-primary bg-yellow-primary border-y-2 border-r-2 border-brown-primary font-semibold rounded-tr-xl rounded-br-xl hover-common hover:bg-yellow-tertiary hover:text-neutral-primary"
  >
    <IoMdRefresh />
  </button>
</div>


      <div className="relative ">
        {/* Prev Button */}
        <button
          onClick={prevPage}
          disabled={startIndex === 0}
          className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
        >
          ◀
        </button>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 justify-items-center py-10 px-20">
          {filteredAndSortedTailors
            .slice(startIndex, startIndex + itemsPerPage)
            .map((tailor) => {
              const userRateValue = userRating[tailor._id];
              const avgRating = ratings[tailor._id] || 0;

              return (
                <TailorCard
                  key={tailor._id}
                  tailor={tailor}
                  currentUserId={currentUserId}
                  setCurrentUserId={setCurrentUserId}
                  followerName={followerName}
                  setFollowerName={setFollowerName}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  showFollowersId={showFollowersId}
                  setShowFollowersId={setShowFollowersId}
                  showFollowingId={showFollowingId}
                  setShowFollowingId={setShowFollowingId}
                  showRatingId={showRatingId}
                  setShowRatingId={setShowRatingId}
                  userRateValue={userRateValue}
                  avgRating={avgRating}
                />
              );
            })}
        </div>

        {/* Next Button */}
        <button
          onClick={nextPage}
          disabled={startIndex + itemsPerPage >= filteredAndSortedTailors.length}
          className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Tailors;
