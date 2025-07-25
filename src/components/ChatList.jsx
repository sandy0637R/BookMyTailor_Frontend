import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChatUser, fetchChatUsersRequest } from '../redux/chatSlice';

const ChatList = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { chatUsers, loading, error, messages } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChatUsersRequest());
  }, [dispatch, messages]); // ✅ re-fetch chat users when new message arrives

  const openChat = (user) => {
    dispatch(setChatUser(user));
  };

  return (
    <div className="p-4 space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error loading chats</p>
      ) : chatUsers.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        [...chatUsers]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // ✅ latest message first
          .map(({ user, lastMessage, timestamp }) => (
            <div
              key={user._id}
              onClick={() => openChat(user)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-gray-600 truncate">{lastMessage}</div>
              <div className="text-xs text-gray-400">{new Date(timestamp).toLocaleString()}</div>
            </div>
          ))
      )}
    </div>
  );
};

export default ChatList;
