import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser, fetchChatRequest } from "../redux/chatSlice";

const ChatList = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { chatUsers, loading, error, chatUser, unreadCounts } = useSelector(
    (state) => state.chat
  );
  const [searchTerm, setSearchTerm] = useState("");

  const openChat = (selectedChat) => {
    const targetUser = selectedChat.user || selectedChat;
    if (!targetUser?._id || targetUser._id === currentUser._id) return;
    if (chatUser?._id === targetUser._id) return;

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
    dispatch(setChatUser(targetUser));
  };

  const getUnreadCount = (userId) => unreadCounts?.[userId] || 0;

  const filteredUsers = chatUsers.filter((u) => {
    const targetUser = u.user || u;
    return targetUser.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-5 h-[686px] bg-yellow-primary bg-cover bg-center"><div className="p-4 space-y-4 bg-neutral-900 h-full rounded-lg overflow-y-auto border border-brown-secondary">
      {/* 🔎 Search */}
      <input
        type="text"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 px-4 text-sm bg-neutral-800 text-gray-200 placeholder-gray-400 border border-neutral-700 rounded-md focus:ring-2 focus:ring-[#d4a373] focus:outline-none"
      />

      {/* 📋 List */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading chats...</p>
      ) : error ? (
        <p className="text-red-400 text-sm">Error loading chats</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-sm">No chats found</p>
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
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200 border-1 border-brown-primary ${
                  isActive
                    ? "bg-[#d4a373]/20 border-[#d4a373]"
                    : "hover:bg-neutral-800 border-neutral-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Unread badge */}
                  {showUnreadBadge && (
                    <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {unreadCount}
                    </span>
                  )}

                  {/* User Info */}
                  <div>
                    <div
                      className={`font-medium ${
                        isActive ? "text-[#d4a373]" : "text-gray-200"
                      }`}
                    >
                      {targetUser.name}
                    </div>
                    <div className="text-sm text-gray-400 truncate w-40">
                      {item.lastMessage || "No messages yet"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div></div>
  );
};

export default ChatList;
