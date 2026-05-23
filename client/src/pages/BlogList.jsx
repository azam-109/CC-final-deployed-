import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import COLLEGES from "../components/colleges";

const TAG_OPTIONS = [
  { value: "fest", label: "Fest" },
  { value: "placement", label: "Placement" },
  { value: "event", label: "Event" },
  { value: "club", label: "Club" },
  { value: "general", label: "General" },
];

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching blogs", err));
  }, []);

  useEffect(() => {
    const tagVals = selectedTags.map((t) => t.value);
    const result = blogs.filter((blog) => {
      const tagMatch =
        tagVals.length === 0 || blog.tags.some((t) => tagVals.includes(t));
      const collegeMatch =
        !selectedCollege || blog.college === selectedCollege.value;
      return tagMatch && collegeMatch;
    });
    setFiltered(result);
  }, [selectedTags, selectedCollege, blogs]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Mentor Blogs</h1>
        <Link
          to="/blogs/create"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          + Write Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-xl shadow">
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Filter by Tags</label>
          <Select
            isMulti
            options={TAG_OPTIONS}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Select tags"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700 mb-1 block">Filter by College</label>
          <Select
            options={COLLEGES}
            value={selectedCollege}
            onChange={setSelectedCollege}
            isClearable
            placeholder="Select college"
          />
        </div>
      </div>

      {/* Blog cards */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 italic text-center mt-10">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog._id}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100"
            >
              {/* Thumbnail */}
              {blog.images?.length > 0 && (
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={blog.images[0]}
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-4">
                {/* Title */}
                <h2 className="text-xl font-semibold text-blue-800 mb-2 line-clamp-2">
                  {blog.title}
                </h2>

                {/* Content preview */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {blog.content}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mb-3">

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {blog.author?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogList;