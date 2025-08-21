import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import loginImage from "../assets/signup.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email.trim(), formData.password);
      setFormData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      const code = err?.code;
      let message = err?.message || "Login failed";
      switch (code) {
        case "auth/invalid-email":
          message = "Invalid email format";
          break;
        case "auth/operation-not-allowed":
          message = "Email/Password sign-in is disabled in Firebase Auth";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled";
          break;
        case "auth/user-not-found":
          message = "No account found with this email";
          break;
        case "auth/wrong-password":
          message = "Incorrect password";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later";
          break;
        case "auth/network-request-failed":
          message = "Network error. Check your connection";
          break;
      }
      setError(message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-gradient-to-br flex items-center justify-end p-8">
        <img
          src={loginImage}
          alt="Login illustration"
          className="w-full max-w-[500px] h-auto"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Welcome Back
            </h1>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Enter the email you used to sign up"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors transform hover:scale-105 duration-200"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={async () => {
                  setError("");
                  try {
                    await loginWithGoogle();
                    setFormData({ email: "", password: "" });
                    navigate("/dashboard");
                  } catch (err) {
                    setError(err?.message || "Google sign-in failed");
                  }
                }}
                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Continue with Google
              </button>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-green-500 hover:text-green-600 font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
}
