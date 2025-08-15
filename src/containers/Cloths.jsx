import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getClothsRequest,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
} from "../redux/authSlice";
import ClothDisplayCard from "../components/ClothDisplayCard";
import { FaSearch } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const Cloths = () => {
  const dispatch = useDispatch();
  const cloths = useSelector((state) => state.auth.cloths);
  const wishlist = useSelector((state) => state.auth.wishlist);
  const cart = useSelector((state) => state.auth.cart);
  const loading = useSelector((state) => state.auth.loading);
  const [expandedId, setExpandedId] = useState(null);

  // Pagination
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  // Store shuffled list
  const [shuffledCloths, setShuffledCloths] = useState([]);

  useEffect(() => {
    dispatch(getClothsRequest());
  }, [dispatch]);

  // When cloths load for the first time, just store them as is (no shuffle)
  useEffect(() => {
    setShuffledCloths(cloths);
  }, [cloths]);

  const isInWishlist = (id) => wishlist.includes(id);
  const isInCart = (id) => cart.some((entry) => entry.item === id);
  const getCartQuantity = (id) =>
    cart.find((entry) => entry.item === id)?.quantity || 0;

  const handleCartToggle = (id, action) => {
    if (action === "add") {
      dispatch(addToCart(id));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const nextPage = () => {
    if (startIndex + itemsPerPage < filteredCloths.length)
      setStartIndex(startIndex + itemsPerPage);
  };

  const prevPage = () => {
    if (startIndex - itemsPerPage >= 0) setStartIndex(startIndex - itemsPerPage);
  };

  // Shuffle helper
  const shuffleArray = (array) => {
    return [...array]
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  // Reset filters + shuffle
  const handleResetFilters = () => {
    setSearchQuery("");
    setSortOption("");
    setGenderFilter("");
    setStartIndex(0);
    setShuffledCloths(shuffleArray(cloths)); // shuffle only on refresh
  };

  // Filter cloths
  const filteredCloths = useMemo(() => {
    return shuffledCloths
      .filter((cloth) => {
        const query = searchQuery.toLowerCase();
        return (
          cloth.name?.toLowerCase().includes(query) ||
          cloth.manufacturer?.toLowerCase().includes(query) ||
          cloth.tailor?.name?.toLowerCase().includes(query) ||
          cloth.type?.toLowerCase().includes(query)
        );
      })
      .filter((cloth) =>
        genderFilter
          ? cloth.gender?.toLowerCase() === genderFilter.toLowerCase()
          : true
      )
      .sort((a, b) => {
        if (sortOption === "low-high") return a.price - b.price;
        if (sortOption === "high-low") return b.price - a.price;
        return 0;
      });
  }, [shuffledCloths, searchQuery, genderFilter, sortOption]);

  return (
    <div className="min-h-screen  p-4  pt-10 pb-10 shadow-common rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-brown-secondary">Cloths</h2>

      {/* Search & Filter Section */}
      <div className="flex flex-wrap  items-center relative">
        {/* Search Icon */}
        <label
          htmlFor="productSearchInput"
          className="rounded-tl-xl rounded-bl-xl pl-4 py-4 text-[21px] border-y-2 border-l-2 bg-yellow-primary cursor-pointer border-brown-primary text-brown-primary"
        >
          <FaSearch />
        </label>

        {/* Search Input */}
        <div className="relative">
          <input
            id="productSearchInput"
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setStartIndex(0);
            }}
            className="px-4 py-4 text-[14px] border-y-2 border-r-2 border-brown-primary text-brown-primary bg-yellow-primary w-64 focus:outline-none "
          />

          {/* No search results dropdown */}
          {searchQuery.trim() !== "" &&
            filteredCloths.length === 0 && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow text-gray-600 text-sm py-2 px-3">
                No search found
              </div>
            )}
        </div>

        {/* Sort by Price */}
        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setStartIndex(0);
          }}
          className="px-4 py-4 border-y-2 border-r-2 w-[150px] border-brown-primary font-semibold bg-yellow-primary text-brown-primary hover-common hover:bg-yellow-tertiary hover:text-neutral-primary"
        >
          <option value="">Price</option>
          <option value="low-high">Low to High</option>
          <option value="high-low">High to Low</option>
        </select>

        {/* Gender Filter */}
        <select
          value={genderFilter}
          onChange={(e) => {
            setGenderFilter(e.target.value);
            setStartIndex(0);
          }}
          className="px-4 py-4 border-y-2 border-r-2 w-[150px] border-brown-primary font-semibold bg-yellow-primary text-brown-primary hover-common hover:bg-yellow-tertiary hover:text-neutral-primary"
        >
          <option value="">Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={handleResetFilters}
          className="px-3 py-3 text-[28.8px] text-brown-primary bg-yellow-primary border-y-2 border-r-2 border-brown-primary font-semibold rounded-tr-xl rounded-br-xl hover-common hover:bg-yellow-tertiary hover:text-neutral-primary"
        >
          <IoMdRefresh />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg font-medium">Loading...</p>
      ) : (
        <div className="relative bg-neutral-primary py-15 rounded-xl">
          <button
            onClick={prevPage}
            disabled={startIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
          >
            ◀
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12">
            {filteredCloths
              .slice(startIndex, startIndex + itemsPerPage)
              .map((cloth) => (
                <ClothDisplayCard
                  key={cloth._id}
                  cloth={cloth}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  isInWishlist={isInWishlist(cloth._id)}
                  isInCart={isInCart(cloth._id)}
                  quantity={getCartQuantity(cloth._id)}
                  handleCartToggle={handleCartToggle}
                  onWishlistToggle={(id) =>
                    isInWishlist(id)
                      ? dispatch(removeFromWishlist(id))
                      : dispatch(addToWishlist(id))
                  }
                  onCartToggle={handleCartToggle}
                />
              ))}
          </div>

          <button
            onClick={nextPage}
            disabled={startIndex + itemsPerPage >= filteredCloths.length}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Cloths;
