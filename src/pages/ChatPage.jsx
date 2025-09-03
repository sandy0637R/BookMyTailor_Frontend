import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import { fetchChatUsersRequest, setChatUser } from "../redux/chatSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const initialized = useRef(false); // Track if user was set from URL

  const profile = useSelector((state) => state.auth.profile);
  const chatUser = useSelector((state) => state.chat.chatUser);
  const chatUsers = useSelector((state) => state.chat.chatUsers);
  const loading = useSelector((state) => state.chat.loading);

  // ✅ Fetch chat users once
  useEffect(() => {
    console.log("[ChatPage] Fetching chat users...");
    dispatch(fetchChatUsersRequest());
  }, [dispatch]);

  // ✅ Set chat user from URL only once
  useEffect(() => {
    if (!initialized.current && userId && chatUsers.length > 0) {
      console.log("[ChatPage] URL userId detected:", userId);

      const selected = chatUsers.find((item) => item.user._id === userId);

      if (selected) {
        console.log("[ChatPage] Setting chat user:", selected.user);
        dispatch(setChatUser(selected.user));
        initialized.current = true;

        // ✅ Clean the URL after setting chat user
        navigate("/chat", { replace: true });
      } else {
        console.warn("[ChatPage] No chat user found for userId:", userId);
      }
    }
  }, [userId, chatUsers, dispatch, navigate]);

  return (
    <div className="flex h-full">
      {/* Left: Chat List */}
      <div className="w-1/3 border-r overflow-y-auto">
        <ChatList currentUser={profile} />
      </div>

      {/* Right: Chat Box or Placeholder */}
      <div className="w-2/3 relative">
        {chatUser ? (
          <ChatBox currentUser={profile} selectedUser={chatUser} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
            {loading ? "Loading..." : "Select a user to start chatting"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
