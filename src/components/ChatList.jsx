import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChatUser, fetchChatUsersRequest } from '../redux/chatSlice';

const ChatList = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { chatUsers, loading, error, chatUser, unreadCounts } = useSelector((state) => state.chat);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchChatUsersRequest());
  }, [dispatch]);

  const openChat = (user) => {
    dispatch(setChatUser(user));
  };

  const getUnreadCount = (userId) => {
    return unreadCounts?.[userId] || 0;
  };

  const filteredUsers = chatUsers.filter(({ user }) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Search user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error loading chats</p>
      ) : filteredUsers.length === 0 ? (
        <p>No chats found</p>
      ) : (
        [...filteredUsers]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map(({ user, lastMessage, timestamp }) => {
            const unreadCount = getUnreadCount(user._id);
            const isActive = chatUser?._id === user._id;
            const showUnreadBadge = unreadCount > 0 && !isActive;

            return (
              <div
                key={user._id}
                onClick={() => openChat(user)}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
                  showUnreadBadge ? 'bg-yellow-100 font-semibold' : ''
                } flex items-center justify-between`}
              >
                <div className="flex items-center space-x-2">
                  {showUnreadBadge && (
                    <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600 truncate">{lastMessage}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(timestamp).toLocaleString()}
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
