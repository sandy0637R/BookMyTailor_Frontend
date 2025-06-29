import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AllTailors = ({ token, setCurrentUserId, setFollowerName }) => {
  const dispatch = useDispatch();

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

    dispatch({ type: "FETCH_TAILORS" });
  }, [token]);

  return null;
};

export default AllTailors;
