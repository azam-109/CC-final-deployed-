import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

function Navbar() {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  // Fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/me`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!data.error) {
          setUser(data);
        }
      } catch (err) {
        console.error("User not logged in");
      }
    };

    fetchUser();
  }, []);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/unread-count`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        setUnreadCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch unread count");
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Listen for chat read updates
    window.addEventListener(
      "messages_read",
      fetchUnreadCount
    );

    return () => {
      window.removeEventListener(
        "messages_read",
        fetchUnreadCount
      );
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide"
        >
          Campus Connect
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm sm:text-base">

          <Link
            to="/"
            className="hover:text-yellow-300 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/questions"
            className="hover:text-yellow-300 transition-colors"
          >
            Questions
          </Link>

          <Link
            to="/askquestion"
            className="hover:text-yellow-300 transition-colors"
          >
            Ask
          </Link>

          {user ? (
            <>
              {/* Message Icon */}
              <Link
                to="/inbox"
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 text-white" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold shadow-md border border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/blogs"
                className="hover:text-yellow-300 transition-colors"
              >
                Blogs
              </Link>

              <Link
                to={`/profile/${user._id}`}
                className="hover:text-yellow-300 transition-colors"
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-300 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="hover:text-yellow-300 transition-colors"
              >
                Signup
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;