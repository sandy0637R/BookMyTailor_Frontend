import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatUser,
  fetchChatRequest,
} from "../redux/chatSlice";

const ChatList = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { chatUsers, loading, error, chatUser, unreadCounts } = useSelector(
    (state) => state.chat
  );
  const [searchTerm, setSearchTerm] = useState("");

  // 📨 Open selected chat
  const openChat = (selectedChat) => {
    const targetUser = selectedChat.user || selectedChat;

    if (!targetUser?._id || targetUser._id === currentUser._id) {
      console.warn("⚠️ Cannot open chat with invalid user", selectedChat);
      return;
    }

    // ✅ Ignore click if same user is already active
    if (chatUser?._id === targetUser._id) return;

    // ✅ Prefer chatId if available
    if (selectedChat._id) {
      dispatch(fetchChatRequest({ chatId: selectedChat._id }));
    } else {
      dispatch(
        fetchChatRequest({
          userId1: currentUser._id,
          userId2: targetUser._id,
        })
      );
    }

    // ✅ Set active chat user
    dispatch(setChatUser(targetUser));
  };

  // 🔔 Get unread message count
  const getUnreadCount = (userId) => unreadCounts?.[userId] || 0;

  // 🔎 Filter users
  const filteredUsers = chatUsers.filter((u) => {
    const targetUser = u.user || u;
    return targetUser.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      {/* List */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error loading chats</p>
      ) : filteredUsers.length === 0 ? (
        <p>No chats found</p>
      ) : (
        [...filteredUsers]
          .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
          .reverse()
          .map((item) => {
            const targetUser = item.user || item;
            const unreadCount = getUnreadCount(targetUser._id);

            const isActive = chatUser?._id === targetUser._id;
            const showUnreadBadge = unreadCount > 0 && !isActive;

            return (
              <div
                key={targetUser._id}
                onClick={() => openChat(item)}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
                  isActive ? "bg-blue-100" : ""
                } ${showUnreadBadge ? "bg-yellow-100 font-semibold" : ""} flex items-center justify-between`}
              >
                <div className="flex items-center space-x-2">
                  {showUnreadBadge && (
                    <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <div>
                    <div className="font-semibold">{targetUser.name}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {item.lastMessage || "No messages yet"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default ChatList;
