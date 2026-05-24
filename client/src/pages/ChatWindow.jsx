import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

function ChatWindow() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  // fetch current user
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setUser(d));
  }, []);

  // fetch existing messages + join socket room
  useEffect(() => {
    if (!conversationId) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/chat/messages/${conversationId}`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
          // notify navbar to refresh count
        window.dispatchEvent(new Event("messages_read"));
      });

    socket.emit("join_room", conversationId);

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [conversationId]);

  // auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user) return;

    socket.emit("send_message", {
      conversationId,
      senderId: user._id,
      content: text.trim(),
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) return <div className="p-6">Loading messages...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[85vh]">

      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 mb-4 shadow-sm">
        <h2 className="font-bold text-gray-800">Chat</h2>
        <p className="text-xs text-gray-400">Messages are private</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-20 text-sm">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id ||
                         msg.sender === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold text-indigo-500 mb-1">
                      {msg.sender?.name}
                    </p>
                  )}
                  <p>{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isMe ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white border border-gray-200 rounded-2xl flex items-center gap-3 px-4 py-2 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message... (Enter to send)"
          className="flex-1 resize-none focus:outline-none text-sm text-gray-700 bg-transparent"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;