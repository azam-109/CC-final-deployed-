import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const TAG_OPTIONS = [
  { value: "fest", label: "Fest" },
  { value: "placement", label: "Placement" },
  { value: "event", label: "Event" },
  { value: "club", label: "Club" },
  { value: "general", label: "General" },
];

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState("");
  const [draftError, setDraftError] = useState("");


  // Handle file input change and generate previews
const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);

  setFiles((prevFiles) => {
    const updatedFiles = [...prevFiles, ...selectedFiles].slice(0, 5);

    // update previews based on FINAL updated files
    setPreviews(
      updatedFiles.map((file) => URL.createObjectURL(file))
    );

    return updatedFiles;
  });

  // reset input so same file can also be selected again
  e.target.value = null;
};

// Remove image and its preview by index
const removeImage = (indexToRemove) => {

  // remove file
  const updatedFiles = files.filter(
    (_, index) => index !== indexToRemove
  );

  // remove preview
  const updatedPreviews = previews.filter(
    (_, index) => index !== indexToRemove
  );

  setFiles(updatedFiles);
  setPreviews(updatedPreviews);
};


  // ── PRESIGNED URL UPLOAD ──
  const uploadImagesToS3 = async () => {
    const imageUrls = [];

    for (const file of files) {
      // 1. ask your server for a presigned URL
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/upload/presign`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        }
      );

      const { presignedUrl, fileUrl } = await res.json();

      // 2. PUT the raw file directly to S3 using the presigned URL
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,  // raw binary — no FormData, no JSON
      });

      // 3. collect the final public S3 URL
      imageUrls.push(fileUrl);
    }

    return imageUrls;
  };

  const handleAIDraft = async () => {
    if (!title.trim()) {
      setDraftError("Enter a title first.");
      return;
    }
    setDrafting(true);
    setDraftError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/ai/draft`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            tags: selectedTags.map((t) => t.value),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setContent(data.content);
    } catch (err) {
      setDraftError(err.message);
    } finally {
      setDrafting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission behavior
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setError(""); // clear previous errors
    let imageUrls = [];

    // upload images first if any selected
    if (files.length > 0) {
      setUploading(true);
      try {
        imageUrls = await uploadImagesToS3();
      } catch (err) {
        setError("Image upload failed: " + err.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // then save blog with the S3 URLs
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },  // plain JSON now
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags.map((t) => t.value),
          images: imageUrls,  // S3 URLs
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate("/blogs");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Write a Blog</h1>

      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Life at IIT Delhi — My First Year"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <Select
            isMulti
            options={TAG_OPTIONS}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Select tags..."
          />
        </div>

        {/* AI Draft */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleAIDraft}
            disabled={drafting}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-xl transition-opacity"
          >
            {drafting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Gemini is writing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
                </svg>
                Generate Draft with Gemini
              </>
            )}
          </button>
          <span className="text-xs text-gray-400">Enter title first · edit before posting</span>
        </div>
        {draftError && <p className="text-red-500 text-sm">{draftError}</p>}
        {content && (
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
            <p className="text-xs text-purple-600">AI draft loaded — review and edit before posting</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Write your blog here or generate with AI above..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photos (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">

              {previews.map((src, i) => (

              <div
                key={i}
                className="relative overflow-visible"
              >
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg z-10"
                >
                  ✕
                </button>
              </div>

              ))}

            </div>
          )}
          {uploading && (
            <p className="text-sm text-blue-500 mt-2 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Uploading images directly to S3...
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {uploading ? "Uploading images..." : submitting ? "Publishing..." : "Publish Blog"}
        </button>
      </div>
    </div>
  );
}

export default CreateBlog;