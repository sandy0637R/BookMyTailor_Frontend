import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllPost from "../components/post/AllPost";

const TailorPost = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch({ type: "FETCH_POSTS" });
      dispatch({ type: "SET_USER_FROM_TOKEN" });
    }
  }, [token, dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-15">
      <h2 className="text-3xl font-bold text-center mb-6">Tailors & Users Posts</h2>
      <AllPost />
    </div>
  );
};

export default TailorPost;
