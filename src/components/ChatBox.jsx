import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ChatBox = ({ currentUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {}, [currentUser, selectedUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !currentUser?._id || !selectedUser?._id) return;

    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setSocketConnected(true);
    });

    newSocket.on('disconnect', () => {
      setSocketConnected(false);
    });

    newSocket.on('connect_error', () => {
      setError('Connection error');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?._id, selectedUser?._id]);

  const fetchConversation = async () => {
    if (!selectedUser?._id || !currentUser?._id) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/chat/conversation/${currentUser._id}/${selectedUser._id}`);
      setMessages(res.data);
    } catch {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages(prev => {
        const exists = prev.some(
          (m) =>
            m.message === message.message &&
            m.sender?._id === message.sender?._id &&
            m.timestamp === message.timestamp
        );
        return exists ? prev : [...prev, message];
      });
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, currentUser, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const payload = {
      receiver: selectedUser._id,
      message: newMessage,
    };

    socket.emit('sendMessage', payload);
    setNewMessage('');
  };

  if (!currentUser || !selectedUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Chat with {selectedUser.name}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {socketConnected ? '🟢 Online' : '🟠 Connecting...'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex max-w-xs break-words p-3 rounded-lg ${
                msg.sender?._id === currentUser._id
                  ? 'self-end bg-blue-500 text-white ml-auto'
                  : 'self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-auto'
              }`}
            >
              <div>
                <div className="text-xs font-semibold opacity-80">
                  {msg.sender?._id === currentUser._id ? 'You' : msg.sender?.name || 'Unknown'}
                </div>
                <div className="mt-1 text-sm">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Just now'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-200 dark:border-gray-700 flex bg-white dark:bg-gray-800"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !socketConnected}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
