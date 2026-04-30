import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore.js";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

export default function AdminLogin() {
  const navigate = useNavigate();
  const loginAdmin = useAdminAuthStore((state) => state.login);
  const authAdmin = useAdminAuthStore((state) => state.authAdmin);
  const isLoggingIn = useAdminAuthStore((state) => state.isLoggingIn);
  const loginWithGoogle = useAdminAuthStore((s) => s.loginWithGoogle);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await loginAdmin({
        email: formData.email,
        password: formData.password,
      });
      if (success) {
        toast.success("Admin logged in successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (authAdmin) navigate("/admin/dashboard", { replace: true });
  }, [authAdmin, navigate]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <form
        className="relative bg-[#121212] text-white rounded-xl shadow-xl p-6 w-[90%] max-w-md"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-2 right-3 text-2xl text-white hover:text-gray-400"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
        <p className="text-sm text-gray-400 mb-4">
          Enter your admin credentials.
        </p>

        <div className="space-y-4">
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none"
            required
          />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const success = await loginWithGoogle(
                    credentialResponse.credential,
                  );

                  if (success) {
                    toast.success("Admin logged in with Google!");
                  }
                } catch (err) {
                  toast.error(err?.message || "Google login failed");
                }
              }}
              onError={() => {
                toast.error("Google login failed");
              }}
              text="continue_with"
              width="100%"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
