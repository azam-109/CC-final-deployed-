import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Inbox() {

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  // Fetch conversations
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/chat/conversations`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setConversations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Messages
      </h1>

      {conversations.length === 0 ? (

        <div className="text-center py-20 text-gray-400">

          <p className="text-lg">
            No conversations yet.
          </p>

          <p className="text-sm mt-1">
            Visit a mentor's profile to start a chat.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {conversations.map((conv) => {

            // Find the OTHER participant
            const other = conv.participants?.find(
              (p) => p._id !== user?._id
            );

            return (

              <div
                key={conv._id}
                onClick={() => navigate(`/chat/${conv._id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">

                  {other?.name?.[0]?.toUpperCase() || "?"}

                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between">

                    <p className="font-semibold text-gray-800">
                      {other?.name}
                    </p>

                      <span className="text-xs text-gray-400 capitalize">
                        {other?.role}
                      </span>

                    <div className="flex items-center gap-2">

                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-semibold">
                          {conv.unreadCount}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* LAST MESSAGE */}
                  <p className="text-sm text-gray-500 truncate">

                    {conv.lastMessage || "Start chatting"}

                  </p>

                  {/* TIME */}
                  <p className="text-xs text-gray-400 mt-1">

                    {new Date(conv.lastMessageAt).toLocaleString()}

                  </p>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Inbox;