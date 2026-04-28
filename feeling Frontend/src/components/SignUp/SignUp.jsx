import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

function SignUp() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const authUser = useAuthStore((state) => state.authUser);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "avatar") setFormData((prev) => ({ ...prev, avatar: files[0] }));
    else setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.avatar) {
      alert("Please upload a profile image.");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("avatar", formData.avatar);

    const success = await signUp(data);
    if (success) navigate("/login");
  };

  // Close modal by navigating home
  const handleClose = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!authUser) {
      document.body.classList.add("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [authUser]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <form
        className="relative bg-[#121212] text-white rounded-xl shadow-xl p-6 w-[90%] max-w-md"
        onSubmit={handleSubmit}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-3 text-2xl text-white hover:text-gray-400"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-2">Create an account</h2>

        <div className="space-y-4 mt-4">
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm bg-[#1f1f1f] border border-gray-600 rounded-md p-2"
          />
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] border border-gray-600"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] border border-gray-600"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] border border-gray-600"
          />

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isSigningUp ? "Creating..." : "Sign in"}
          </button>

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
                console.error("Google user login error:", error);
                const message =
                  error.response?.data?.message ||
                  error.response?.data?.error ||
                  "Google login failed";

                toast.error(message);
              }
            }}
            onError={() => toast.error("Google login failed")}
          />
        </div>

        {/* Login link */}
        <div className="text-center mt-3">
          <button
            type="button"
            className="text-sm text-gray-300 hover:underline"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
