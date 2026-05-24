import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import COLLEGES from "../components/colleges";

const TAG_OPTIONS = [
  { value: "hostel", label: "Hostel" },
  { value: "placement", label: "Placement" },
  { value: "admission", label: "Admission Process" },
  { value: "ragging", label: "Ragging Concerns" },
  { value: "life", label: "Campus Life" },
  { value: "curriculum", label: "Curriculum" },
  { value: "clubs", label: "Clubs & Events" },
  { value: "mess", label: "Mess/Food" },
  { value: "facilities", label: "Facilities" },
  { value: "faculty", label: "Faculty" },
  { value: "internship", label: "Internship" },
  { value: "fees", label: "Fees & Scholarship" },
  { value: "other", label: "Other" },
];

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/questions`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  useEffect(() => {
    const tagValues = selectedTags.map((tag) => tag.value);
    const filteredData = questions.filter((q) => {
      const tagMatch =
        tagValues.length === 0 || q.tags.some((tag) => tagValues.includes(tag));
      const collegeMatch =
        !selectedCollege || q.college === selectedCollege.value;
      return tagMatch && collegeMatch;
    });
    setFiltered(filteredData);
  }, [selectedTags, selectedCollege, questions]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header and Ask Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-indigo-800">All Questions</h1>
        <button
          onClick={() => navigate("/askquestion")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
        >
          Ask a Question
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow border rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Filter by College
            </label>
            <Select
              options={COLLEGES}
              value={selectedCollege}
              onChange={setSelectedCollege}
              placeholder="Choose College"
              isClearable
              className="text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Filter by Tags
            </label>
            <Select
              options={TAG_OPTIONS}
              value={selectedTags}
              onChange={setSelectedTags}
              isMulti
              placeholder="Choose Tags"
              className="text-black"
            />
          </div>
        </div>
      </div>

      {/* Question List */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No questions match your filters.
        </p>
      ) : (
        <div className="space-y-6">
          {filtered.map((q) => (
            <div
              key={q._id}
              className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <Link to={`/questions/${q._id}`}>
                <h2 className="text-xl font-semibold text-indigo-700 hover:underline mb-1">
                  {q.title}
                </h2>
              </Link>
              <p className="text-gray-800 text-sm mb-3 line-clamp-3">
                {q.description}
              </p>

              <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-2">
                <div>
                  <span className="font-medium text-gray-700">Asked by: </span>
                  {q.askedBy?.name || "Anonymous"}{" "}
                  {q.askedBy?.role && `(${q.askedBy.role})`}
                </div>
                {q.college && (
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                    🎓 {q.college}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {q.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-2 py-0.5 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Questions;
