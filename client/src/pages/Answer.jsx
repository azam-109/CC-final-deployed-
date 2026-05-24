import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Answer() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [suggesting, setSuggesting] = useState(false);   // ← NEW
  const [suggestError, setSuggestError] = useState("");  // ← NEW

  const fetchData = async () => {
    try {
      const [qRes, aRes, uRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_URL}/answers/${id}`, { credentials: "include" }),
        fetch(`${import.meta.env.VITE_API_URL}/user/me`, { credentials: "include" }),
      ]);

      const [qData, aData, uData] = await Promise.all([
        qRes.json(),
        aRes.json(),
        uRes.json(),
      ]);

      setQuestion(qData);
      const sorted = [...aData].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
      setAnswers(sorted);
      if (!uData.error) setUser(uData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ── NEW: call backend AI route ──
  const handleSuggest = async () => {
    if (!question) return;
    setSuggesting(true);
    setSuggestError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/suggest`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: question.title,
          description: question.description,
          college: question.college,
          tags: question.tags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get suggestion");
      setAnswerText(data.suggestion);
    } catch (err) {
      setSuggestError(err.message);
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/answers`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: answerText, questionId: id }),
    });

    if (res.ok) {
      await fetchData();
      setAnswerText("");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to post answer.");
    }
  };

  const handleVote = async (answerId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/answers/${answerId}/vote`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setAnswers((prev) =>
      [...prev]
        .map((a) => (a._id === answerId ? { ...a, voteCount: data.voteCount } : a))
        .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
    );
  };

  if (loading) return <div className="p-6 font-medium">Loading…</div>;
  if (!question || question.error)
    return <div className="p-6 text-red-600">Error loading question.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Question Box */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
        <h2 className="text-3xl font-bold text-indigo-700 mb-3">{question.title}</h2>
        <p className="text-gray-800 text-lg">{question.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {question.tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Answer List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Answers</h3>
        {answers.length === 0 ? (
          <p className="text-gray-500 italic">No answers yet. Be the first to help!</p>
        ) : (
          <div className="space-y-6">
            {answers.map((a) => (
              <div
                key={a._id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition hover:shadow-lg"
              >
                <p className="text-gray-900 text-base leading-relaxed">{a.content}</p>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <span>
                    —{" "}
                    {a.answeredBy?._id ? (
                      <Link
                        to={`/profile/${a.answeredBy._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {a.answeredBy.name}
                      </Link>
                    ) : (
                      "Anonymous"
                    )}{" "}
                    ({a.answeredBy?.role || "Student"})
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => handleVote(a._id)}
                    className="text-sm text-indigo-600 font-medium hover:underline flex items-center"
                  >
                    👍 <span className="ml-1">Vote</span>
                  </button>
                  <span className="text-gray-800 text-sm font-semibold">
                    {a.voteCount || 0} vote{a.voteCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Form — only for mentors of same college */}
      {user?.role === "mentor" && user.college === question.college && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-xl border border-green-200 space-y-4"
        >
          <h4 className="text-xl font-bold text-green-700">Your Answer</h4>

          {/* ── NEW: Gemini suggest button ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleSuggest}
              disabled={suggesting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-xl transition-opacity"
            >
              {suggesting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Gemini is thinking...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
                  </svg>
                  Suggest with Gemini
                </>
              )}
            </button>
            <span className="text-xs text-gray-400">
              AI drafts an answer · review and edit before posting
            </span>
          </div>

          {/* AI draft loaded notice */}
          {answerText && (
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <p className="text-xs text-purple-600">
                AI draft loaded — review and edit before submitting
              </p>
            </div>
          )}

          {/* Error */}
          {suggestError && (
            <p className="text-red-500 text-sm">{suggestError}</p>
          )}
          {/* ── END NEW ── */}

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={5}
            placeholder="Write a thoughtful answer to help the community..."
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition font-medium"
          >
            Submit Answer
          </button>
        </form>
      )}
    </div>
  );
}

export default Answer;