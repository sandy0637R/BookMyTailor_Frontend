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
      <div className="w-1/3 border-r border-brown-secondary overflow-y-auto">
        <ChatList currentUser={profile} />
      </div>

      {/* Right: Chat Box or Placeholder */}
      <div className="w-2/3 relative">
        {chatUser ? (
          <ChatBox currentUser={profile} selectedUser={chatUser} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-[url('/assets/Creative-dark.jpg')] bg-center">
  {loading ? (
    <span className="text-gray-400 text-base animate-pulse">
      Loading chats...
    </span>
  ) : (
    <span className="text-neutral-primary text-lg font-light tracking-wide">
      Select a user to <span className="text-yellow-primary font-medium">start chatting</span>
    </span>
  )}
</div>

        )}
      </div>
    </div>
  );
};

export default ChatPage;
