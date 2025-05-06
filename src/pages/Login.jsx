import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import loginImage from "../assets/login.png";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fakeToken = "sample-jwt-token";
      const fakeUser = { name: "John Doe", email };
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(fakeUser));
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen min-w-screen bg-gray-100">
      {/* Branding Section */}
      <div className="lg:flex-1 flex items-center justify-center bg-gradient-to-tr from-blue-700 to-blue-900 text-white p-8 md:p-12">
        <div className="text-center max-w-[500px] flex flex-col items-center justify-center">
          <h1 className="text-4xl xl:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Shift Tracker
          </h1>
          <p className="text-lg xl:text-xl font-medium leading-relaxed drop-shadow-md mb-6">
            Track time. Stay productive. Manage your work shifts with ease.
          </p>
          <img
            src={loginImage}
            alt="Login visual"
            className="w-80 h-auto rounded-xl shadow-xl opacity-90"
          />
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 min-h-screen relative overflow-hidden">
        {/* Optional background glow */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-3xl animate-pulse -z-10" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100 rounded-full opacity-20 blur-3xl animate-pulse -z-10" />

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-[500px] flex flex-col justify-center z-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-gray-900">
            Employee Login
          </h2>

          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-4 focus-within:ring-blue-400 focus-within:border-blue-600 transition">
              <div className="px-4 text-gray-500">
                <FaUser />
              </div>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-3 rounded-xl focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-4 focus-within:ring-blue-400 focus-within:border-blue-600 transition">
              <div className="px-4 text-gray-500">
                <FaLock />
              </div>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-3 rounded-xl focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full !bg-blue-600 !text-white py-3 rounded-xl font-semibold text-lg hover:!bg-blue-700 transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:!ring-blue-500"
          >
            Login
          </button>

          <p className="text-xs text-gray-400 text-center mt-6 select-none">
            © 2025 Shift Tracker. All rights reserved.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
