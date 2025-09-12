import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatRequest, markMessagesReadRequest } from "../redux/chatSlice";

const ChatBox = ({ currentUser, selectedUser }) => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const [firstUnreadId, setFirstUnreadId] = useState(null);

  // 📩 Fetch messages when chat changes
  useEffect(() => {
    if (!currentUser?._id || !selectedUser?._id) return;

    // ✅ Use chatId if available (from ChatList), fallback to userIds
    dispatch(
      fetchChatRequest(
        selectedUser.chatId
          ? { chatId: selectedUser.chatId }
          : { userId1: currentUser._id, userId2: selectedUser._id }
      )
    );
  }, [dispatch, currentUser?._id, selectedUser?._id, selectedUser?.chatId]);

  // 🔌 Socket connection (init once per currentUser)
  useEffect(() => {
    if (!currentUser?._id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token, userId: currentUser._id },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => setSocketConnected(true));
    newSocket.on("disconnect", () => setSocketConnected(false));
    newSocket.on("connect_error", (err) =>
      console.error("⚠️ Socket error:", err)
    );

    // 📥 Listen for new messages (only refresh if for this chat)
    newSocket.on("newMessage", (msg) => {
      const inThisChat =
        (msg.sender === selectedUser?._id &&
          msg.receiver === currentUser._id) ||
        (msg.sender === currentUser._id && msg.receiver === selectedUser?._id);

      if (inThisChat) {
        dispatch(
          fetchChatRequest(
            selectedUser.chatId
              ? { chatId: selectedUser.chatId }
              : { userId1: currentUser._id, userId2: selectedUser._id }
          )
        );
      }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [currentUser?._id, selectedUser?._id, selectedUser?.chatId, dispatch]);

  // 👁️ Mark unread messages as read
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessages = messages.filter((msg) => {
        const receiverId =
          typeof msg.receiver === "string" ? msg.receiver : msg.receiver?._id;
        return !msg.read && receiverId === currentUser._id;
      });

      if (unreadMessages.length > 0) {
        setFirstUnreadId(unreadMessages[0]._id);
        dispatch(markMessagesReadRequest(unreadMessages.map((m) => m._id)));
      } else {
        setFirstUnreadId(null);
      }
    }
  }, [messages, currentUser._id, dispatch]);

  // 🔽 Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✉️ Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const tempMessage = {
      _id: Date.now().toString(),
      sender: { _id: currentUser._id, name: currentUser.name },
      receiver: { _id: selectedUser._id, name: selectedUser.name },
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      temp: true,
    };

    // ✅ Optimistic UI update
    dispatch({ type: "chat/addLocalMessage", payload: tempMessage });

    socket.emit("sendMessage", {
      sender: currentUser._id,
      receiver: selectedUser._id,
      message: newMessage,
    });

    setNewMessage("");
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
    <div className="flex flex-col h-[686px] bg-brown-tertiary ">
      {/* Header */}
      <div className="p-4 border-b border-brown-secondary bg-brown-tertiary">
        <h3 className="text-lg font-semibold text-neutral-primary">
          Chat with {selectedUser.name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm font-medium">
          <span
            className={`w-3 h-3 rounded-full ${
              socketConnected ? "bg-green-500" : "bg-orange-400 animate-pulse"
            }`}
          ></span>
          <span
            className={`${
              socketConnected ? "text-green-600" : "text-orange-500"
            }`}
          >
            {socketConnected ? "Online" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/assets/Creative-dark.jpg')] bg-cover bg-center">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <React.Fragment key={msg._id}>
              {firstUnreadId === msg._id && (
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 my-2">
                  ── New Messages ──
                </div>
              )}
              <div
                className={`flex max-w-xs break-words p-3 rounded-lg ${
                  msg.sender?._id === currentUser._id
                    ? "self-end bg-yellow-primary text-brown-tertiary ml-auto"
                    : "self-start bg-brown-primary text-neutral-primary  mr-auto"
                }`}
              >
                <div>
                  <div className="text-xs font-semibold opacity-80">
                    {msg.sender?._id === currentUser._id
                      ? "You"
                      : msg.sender?.name || "Unknown"}
                  </div>
                  <div className="mt-1 text-sm">{msg.message}</div>
                  <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Just now"}
                    {msg.sender?._id === currentUser._id && (
                      <span>{msg.read ? "✔✔" : "✔"}</span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-3 bg-brown-tertiary border-t border-brown-secondary shadow-sm"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 bg-neutral-900 text-neutral-primary rounded-l-sm focus:outline-none focus:ring-1 focus:ring-brown-primary placeholder-brown-secondary transition-colors"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !socketConnected}
          className={`px-4 py-2 rounded-r-sm font-medium  transition-colors shadow-sm ${
            newMessage.trim() && socketConnected
              ? "bg-yellow-primary hover-common hover:bg-yellow-secondary text-brown-tertiary"
              : "bg-gray-500 cursor-not-allowed text-neutral-primary"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
