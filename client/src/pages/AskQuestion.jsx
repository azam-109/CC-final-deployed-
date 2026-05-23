import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [college, setCollege] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagValues = tags.map((tag) => tag.value);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/questions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tags: tagValues,
        college: college?.value || "",
      }),
    });

    if (res.ok) {
      navigate("/questions");
    } else {
      alert("Failed to post question");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          📝 Ask a Question
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., What are the internship opportunities for 3rd year?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              placeholder="Provide more details, context, or specific concerns..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Tags (max 4)
            </label>
            <Select
              options={TAG_OPTIONS}
              isMulti
              value={tags}
              onChange={setTags}
              placeholder="Choose relevant tags"
              className="text-black"
              maxMenuHeight={180}
            />
          </div>

          {/* College */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              College
            </label>
            <Select
              options={COLLEGES}
              value={college}
              onChange={setCollege}
              placeholder="Choose your college"
              className="text-black"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-lg font-medium shadow-md hover:bg-indigo-700 transition"
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskQuestion;
