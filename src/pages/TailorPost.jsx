import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllPost from "../components/post/AllPost";
import { FaSearch, FaComments } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { HiSpeakerphone } from "react-icons/hi";
import { RiRefreshFill } from "react-icons/ri";

const TailorPost = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const posts = useSelector((state) => state.post.posts);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (token) {
      dispatch({ type: "FETCH_POSTS" });
      dispatch({ type: "SET_USER_FROM_TOKEN" });
    }
  }, [token, dispatch]);

  // ✅ Filter + Sort + Refresh shuffle
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = [...posts];

    // search (username OR hashtags OR caption)
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();

      filtered = filtered.filter((p) => {
        const usernameMatch = p.postedBy?.name
          ?.toLowerCase()
          .includes(lowerSearch);
        const captionMatch = p.caption?.toLowerCase().includes(lowerSearch);
        const hashtagMatch = p.hashtags?.some((tag) =>
          tag.toLowerCase().includes(lowerSearch)
        );

        return usernameMatch || captionMatch || hashtagMatch;
      });
    }

    // sort
    if (sort === "likes") {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (sort === "comments") {
      filtered.sort(
        (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
      );
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first
    }

    // refresh shuffle (only runs when refreshKey changes)
    if (refreshKey > 0) {
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    return filtered;
  }, [posts, search, sort, refreshKey]);

  return (
    <div className="grid grid-cols-12 min-h-screen bg-[var(--color-neutral-primary)]">
      {/* Left Sidebar */}
      <div className="col-span-3 bg-[url('/assets/Creative.png')] bg-cover bg-center text-white p-4 fixed top-0 left-0 h-screen w-1/4">
        <div className="bg-brown-tertiary p-5 mt-13 rounded-lg">
          {" "}
          <h2 className="text-lg font-bold mb-4">Search & Sort</h2>
          <div className="w-full flex items-center justify-center bg-yellow-primary text-brown-primary hover:bg-yellow-100 hover-common border-2  hover:border-yellow-tertiary mb-4 rounded-sm ">
            <span className="flex w-[10%] justify-center items-center text-xl">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[90%] p-2 rounded  focus:outline-none "
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button onClick={() => setSort("date")} className="post-sort-main">
              <span className="mr-2">
                <HiSpeakerphone />
              </span>{" "}
              Latest
            </button>
            <button
              onClick={() => setSort("likes")}
              className=" post-sort-main"
            >
              <span className="mr-2">
                <BiSolidLike />
              </span>
              Likes
            </button>
            <button
              onClick={() => setSort("comments")}
              className="post-sort-main"
            >
              <span className="mr-2">
                <FaComments />
              </span>{" "}
              Comments
            </button>
            {/* ✅ Refresh Button */}
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="flex justify-self-end items-center p-2 border-2 border-brown-primary rounded-sm text-brown-primary hover:bg-brown-primary  hover:text-neutral-primary hover:border-neutral-primary"
            >
              <span className="mr-2">
                <RiRefreshFill />
              </span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Middle Content */}
      <div className="col-span-6 col-start-4 px-6 py-8 overflow-y-auto bg-yellow-primary">
        <h2 className="text-3xl font-bold text-center mb-6">Posts</h2>
        <AllPost posts={filteredPosts} />
      </div>

      {/* Right Sidebar */}
      <div className=" fixed right-0 top-0 h-screen w-1/4 ">
        <img
          src="/assets/Creative.png"
          alt=""
          className="bg-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default TailorPost;
