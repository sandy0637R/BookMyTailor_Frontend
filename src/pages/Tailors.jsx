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

      {/* Search & Sort Section */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-brown-tertiary/5 p-4 rounded-xl border border-brown-primary/10">
        <div className="flex items-center flex-1 min-w-[250px] relative">
          <span className="absolute left-4 text-brown-primary/60 text-base">
            <FaSearch />
          </span>
          <input
            id="searchInput"
            type="text"
            placeholder="Search tailors by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setStartIndex(0);
            }}
            className="w-full !pl-11 !py-2.5 !rounded-lg !border-brown-primary/20"
          />
          {searchQuery.trim() !== "" && filteredAndSortedTailors.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-neutral-primary border border-brown-primary/20 rounded-lg shadow-premium text-brown-primary text-sm py-2.5 px-4 z-20">
              No tailors found matching your search.
            </div>
          )}
        </div>

        {/* Fees Sort */}
        <select
          value={sortConfig.key === "fees" ? sortConfig.direction : ""}
          onChange={(e) => handleSortChange("fees", e.target.value)}
          className="min-w-[150px] !py-2.5 !rounded-lg !border-brown-primary/20 cursor-pointer font-semibold text-sm bg-neutral-primary text-brown-secondary"
        >
          <option value="">Sort Fees</option>
          <option value="desc">Fees: High to Low</option>
          <option value="asc">Fees: Low to High</option>
        </select>

        {/* Rating Sort */}
        <select
          value={sortConfig.key === "rating" ? sortConfig.direction : ""}
          onChange={(e) => handleSortChange("rating", e.target.value)}
          className="min-w-[150px] !py-2.5 !rounded-lg !border-brown-primary/20 cursor-pointer font-semibold text-sm bg-neutral-primary text-brown-secondary"
        >
          <option value="">Sort Rating</option>
          <option value="desc">Rating: High to Low</option>
          <option value="asc">Rating: Low to High</option>
        </select>

        {/* Followers Sort */}
        <select
          value={sortConfig.key === "followers" ? sortConfig.direction : ""}
          onChange={(e) => handleSortChange("followers", e.target.value)}
          className="min-w-[150px] !py-2.5 !rounded-lg !border-brown-primary/20 cursor-pointer font-semibold text-sm bg-neutral-primary text-brown-secondary"
        >
          <option value="">Sort Followers</option>
          <option value="desc">Followers: High to Low</option>
          <option value="asc">Followers: Low to High</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={handleReset}
          title="Refresh Tailors"
          className="w-10 h-10 flex items-center justify-center text-xl text-neutral-primary bg-gradient-gold hover:opacity-95 rounded-lg transition shadow-sm active:scale-95 cursor-pointer"
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
