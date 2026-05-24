import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Login successful! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setError(data.error || "❌ Invalid credentials.");
      }
    } catch (err) {
      console.log(err);
      
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-indigo-100 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Welcome Back 👋
        </h1>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-300 rounded p-2 mb-4 text-sm text-center animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 bg-green-50 border border-green-300 rounded p-2 mb-4 text-sm text-center animate-pulse">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Not registered? <a href="/signup" className="text-indigo-600 hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
