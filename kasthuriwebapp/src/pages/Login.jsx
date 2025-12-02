import React, { useContext, useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../Utill/validation";
import axiosConfig from "../Utill/axiosConfig";
import { API_ENDPOINTS } from "../Utill/apiEndPoints";
import { AppContext } from "../context/AppContext";
import { LoaderCircle, Mail, Lock, ArrowLeft, Phone } from "lucide-react";
import { assets } from "../assets/assets";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }
    setError("");

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F5EFFF] via-white to-[#E5D9F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Login Card - Everything now inside */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-[#E5D9F2]">
          {/* Back to Home + Secure Indicator (Top Row) */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-500 hover:text-[#A594F9] text-sm font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>

          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={assets.logo}
              alt="Kasthuri Enterprises Logo"
              className="h-16 w-16 rounded-full object-cover ring-4 ring-[#A594F9] mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-center">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#A594F9] focus:ring-4 focus:ring-[#F5EFFF] outline-none transition-all duration-300"
                  hideLabel={true}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#A594F9] focus:ring-4 focus:ring-[#F5EFFF] outline-none transition-all duration-300"
                  hideLabel={true}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#A594F9] hover:text-[#CDC1FF] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <p className="text-red-800 text-sm text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
              className={`w-full bg-gradient-to-r from-[#A594F9] to-[#CDC1FF] text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Admin-Only Notice + Contact Info */}
          <div className="text-center space-y-4 mt-8">
            <div className="bg-purple-50 border border-[#E5D9F2] rounded-xl p-5">
              <p className="text-sm font-bold text-[#A594F9]">
                This login is for admins only
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Customers: Please contact us for bookings or inquiries
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 text-sm">
              <a
                href="tel:+94XXXXXXXXX"
                className="flex items-center gap-2 text-[#A594F9] hover:text-[#CDC1FF] transition-colors"
              >
                <Phone size={16} />
                <span>+94 XX XXX XXXX</span>
              </a>
              <a
                href="mailto:info@kasthuri.lk"
                className="flex items-center gap-2 text-[#A594F9] hover:text-[#CDC1FF] transition-colors"
              >
                <Mail size={16} />
                <span>info@kasthuri.lk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          © 2025 Kasthuri Enterprises. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
