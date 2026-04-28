import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,

      isCheckingAuth: false,
      isSigningUp: false,
      isLoggingIn: false,
      isLoggingOut: false,

      isUpdatingProfile: false,
      isUpdatingAvatar: false,
      isChangingPassword: false,

      checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
          const res = await axiosInstance.get("/users/currentUser");
          set({ authUser: res.data.data });
        } catch (error) {
          if (error.response?.status === 401) {
            set({ authUser: null });
          } else {
            console.error("User checkAuth error:", error);
          }
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      login: async (formData) => {
        set({ isLoggingIn: true });

        try {
          const res = await axiosInstance.post("/users/login", formData);
          set({ authUser: res.data.data.user });
          toast.success("Logged in!");
          return true;
        } catch (error) {
          console.error("User login error:", error);
          throw error;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      signUp: async (formData) => {
        set({ isSigningUp: true });

        try {
          const res = await axiosInstance.post("/users/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          set({ authUser: res.data.data });
          toast.success("Account created!");
          return true;
        } catch (error) {
          console.error("User signup error:", error);
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Signup failed";

          throw new Error(message);
        } finally {
          set({ isSigningUp: false });
        }
      },

      logout: async () => {
        set({ isLoggingOut: true });

        try {
          await axiosInstance.post("/users/logout");
          set({ authUser: null });
          localStorage.removeItem("auth-storage");
          toast.success("Logged out!");
        } catch {
          toast.error("Logout failed");
        } finally {
          set({ isLoggingOut: false });
        }
      },

      updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });

        try {
          const res = await axiosInstance.patch(
            "/users/updateUserAccount",
            formData,
          );

          // 🔥 IMPORTANT FIX — merge instead of replace
          set({
            authUser: {
              ...get().authUser,
              ...res.data.data,
            },
          });

          toast.success("Profile updated successfully!");
          return true;
        } catch (error) {
          console.error("Update profile error:", error);
          toast.error(error.response?.data?.message || "Profile update failed");
          return false;
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      updateAvatar: async (file) => {
        set({ isUpdatingAvatar: true });

        try {
          const formData = new FormData();
          formData.append("avatar", file);

          const res = await axiosInstance.patch(
            "/users/updateUserAvatar",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );

          // 🔥 IMPORTANT FIX — merge instead of replace
          set({
            authUser: {
              ...get().authUser,
              ...res.data.user,
            },
          });

          toast.success("Profile updated successfully!");
          return true;
        } catch (error) {
          console.error("Update avatar error:", error);
          toast.error(error.response?.data?.message || "Avatar update failed");
          return false;
        } finally {
          set({ isUpdatingAvatar: false });
        }
      },

      changePassword: async (formData) => {
        set({ isChangingPassword: true });

        try {
          const user = get().authUser;

          if (user?.isGoogleUser) {
            toast.error(
              "This account was created using Google. Password login is not available.",
            );
            return false;
          }

          await axiosInstance.post("/users/changePassword", formData);
          toast.success("Password changed successfully!");
          return true;
        } catch (error) {
          console.error("Change password error:", error);
          toast.error(
            error.response?.data?.message || "Password change failed",
          );
          return false;
        } finally {
          set({ isChangingPassword: false });
        }
      },

      deleteAccount: async () => {
        try {
          await axiosInstance.delete("/users/deleteAccount");

          set({ authUser: null });

          window.location.replace("/");

          return true;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to delete account",
          );
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
