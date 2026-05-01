import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const authUser = useAuthStore((state) => state.authUser);

  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        "Login failed";

      toast.error(message);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <form
        className="relative bg-[#121212] text-white rounded-xl shadow-xl p-6 w-[90%] max-w-md lg:max-w-lg"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-3 text-2xl text-white hover:text-gray-400"
        >
          ×
        </button>

        <h2 className="text-xl lg:text-2xl font-semibold mb-2">
          Login to your account
        </h2>
        <p className="text-sm lg:text-lg text-gray-400 mb-4">
          Enter your email and password to login.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm lg:text-base font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 lg:px-6 lg:py-4 lg:text-lg rounded-md bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm lg:text-base font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 lg:px-6 lg:py-4 lg:text-lg rounded-md bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-white text-black py-2 lg:py-3 lg:text-xl rounded-md font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={async (res) => {
                try {
                  await axiosInstance.post("/users/google", {
                    credential: res.credential,
                  });

                  await useAuthStore.getState().checkAuth();
                  toast.success("Logged in with Google!");
                  navigate("/");
                } catch (error) {
                  const message =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Google login failed";

                  toast.error(message);
                }
              }}
              onError={() => toast.error("Google login failed")}
              text="continue_with"
              width="100%"
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-sm lg:text-base text-gray-300 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
