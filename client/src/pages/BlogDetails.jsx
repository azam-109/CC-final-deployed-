import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 text-lg">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Back button */}
      <Link
        to="/blogs"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Blogs
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

        {/* Cover Image */}
        {blog.images?.length > 0 && (
            <div className="w-full bg-gray-100 flex justify-center items-center p-4">
            <img
                src={blog.images[0]}
                alt={blog.title}
                className="max-h-[600px] w-auto object-contain rounded-xl"
            />
            </div>
        )}

        <div className="p-8">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Author Section */}
          <div className="flex items-center gap-4 mb-6">

            {/* Profile Pic */}

            <div>
              <Link
                to={`/profile/${blog.author?._id}`}
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                {blog.author?.name}
              </Link>

              <p className="text-sm text-gray-500">
                {blog.college}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-8 whitespace-pre-line">
            {blog.content}
          </div>

          {/* Extra Images */}
          {blog.images?.length > 1 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Gallery
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`gallery-${i}`}
                      className="w-full h-72 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BlogDetails;