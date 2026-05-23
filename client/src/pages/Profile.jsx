import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);  // ← NEW
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);  // ← NEW

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, qRes, aRes, meRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, { credentials: "include" }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/questions/user/${id}`, { credentials: "include" }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/answers/user/${id}`, { credentials: "include" }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, { credentials: "include" }), // ← NEW
        ]);

        const [userData, qData, aData, meData] = await Promise.all([
          userRes.json(),
          qRes.json(),
          aRes.json(),
          meRes.json(),  // ← NEW
        ]);

        if (userData.error) {
          setUser(null);
        } else {
          setUser(userData);
          setQuestions(qData || []);
          setAnswers(aData || []);
          if (!meData.error) setCurrentUser(meData);  // ← NEW
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // ← NEW: start or open existing conversation
  const startChat = async () => {
    setChatLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chat/conversations`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId: user._id }),
        }
      );
      const conv = await res.json();
      navigate(`/chat/${conv._id}`);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-lg font-semibold animate-pulse">Loading Profile…</div>;
  if (!user) return <div className="p-6 text-red-600 font-medium">User not found.</div>;

  // show button only if viewing someone else's profile
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">

      {/* Profile Card */}
      <div className="bg-white shadow-lg border border-blue-100 rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
            👤 {user.name}
          </h2>

          {/* ← NEW: Message button — only shows when viewing someone else */}
          {currentUser && !isOwnProfile && (
            <button
              onClick={startChat}
              disabled={chatLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
            >
              {chatLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Opening...
                </>
              ) : (
                <>
                  💬 Message {user.name.split(" ")[0]}
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-2 text-gray-700 text-sm md:text-base mt-4">
          <p><span className="font-semibold text-gray-600">📧 Email:</span> {user.email}</p>
          <p><span className="font-semibold text-gray-600">🎓 Role:</span> {user.role}</p>
          {user.college && (
            <p><span className="font-semibold text-gray-600">🏫 College:</span> {user.college}</p>
          )}
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white shadow-lg border border-green-100 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-green-700 mb-4">
          📌 Questions by {user.name}
        </h3>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li
                key={q._id}
                className="p-4 border border-gray-200 rounded-xl hover:bg-green-50 transition"
              >
                <Link to={`/questions/${q._id}`}>
                  <h4 className="text-lg font-semibold text-blue-600 hover:underline">
                    {q.title}
                  </h4>
                </Link>
                <p className="text-gray-700 text-sm mt-1">{q.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Answers Section */}
      {user.role === "mentor" && (
        <div className="bg-white shadow-lg border border-purple-100 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">
            ✍️ Answers by {user.name}
          </h3>
          {answers.length === 0 ? (
            <p className="text-gray-500">No answers written yet.</p>
          ) : (
            <ul className="space-y-4">
              {answers.map((a) => (
                <li
                  key={a._id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-purple-50 transition"
                >
                  <p className="text-gray-800 text-sm">{a.content}</p>
                  {a.question?._id && (
                    <p className="text-xs text-gray-500 mt-2">
                      ↳ on{" "}
                      <Link
                        to={`/questions/${a.question._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {a.question.title}
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;