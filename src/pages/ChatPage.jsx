import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import { fetchChatUsersRequest, setChatUser } from "../redux/chatSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);
  const chatUser = useSelector((state) => state.chat.chatUser);
  const chatUsers = useSelector((state) => state.chat.chatUsers);
  const loading = useSelector((state) => state.chat.loading);

  useEffect(() => {
    dispatch(fetchChatUsersRequest());
  }, [dispatch]);

  // TEMP: auto-select chatUser if none selected
  useEffect(() => {
    if (profile && !chatUser && chatUsers.length > 0) {
      dispatch(setChatUser(chatUsers[0]));
    }
  }, [dispatch, profile, chatUser, chatUsers]);

  return (
    <div className="flex h-full">
      {/* Left: Chat List */}
      <div className="w-1/3 border-r overflow-y-auto">
        <ChatList chatUsers={chatUsers} currentUser={profile} />
      </div>

      {/* Right: ChatBox or Placeholder */}
      <div className="w-2/3">
        {chatUser ? (
          <ChatBox currentUser={profile} selectedUser={chatUser} />
        ) : loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
