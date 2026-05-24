import { useState } from "react";
import { useNavigate } from "react-router-dom";
import COLLEGES from "../components/colleges";
import Select from "react-select";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "aspirant",
    college: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.role === "mentor" && !form.college) {
      setError("Mentors must select a college.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      college: form.role === "mentor" ? form.college.value : undefined,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    console.log(1);
    if (res.ok) {
      navigate("/login");
    } else {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 px-4">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl border border-indigo-200 rounded-2xl p-8 w-full max-w-lg transition-all duration-300">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Create Your Account
        </h2>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-4 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="aspirant">Aspirant</option>
            <option value="mentor">Mentor</option>
          </select>

          {form.role === "mentor" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your College
              </label>
              <Select
                options={COLLEGES}
                value={form.college}
                onChange={(selected) => setForm({ ...form, college: selected })}
                placeholder="Choose your college"
                className="text-black"
                isSearchable
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-xl transition-all"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
