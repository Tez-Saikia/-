import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "@/lib/axios.js";

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      authAdmin: false,
      adminData: null,
      isLoggingIn: false,
      isCheckingAdminAuth: false,
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      login: async ({ email, password }) => {
        set({ isLoggingIn: true });

        try {
          const { data } = await axiosInstance.post("/admin/login", {
            email,
            password,
          });

          if (data?.data?.admin) {
            set({
              authAdmin: true,
              adminData: data.data.admin,
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Admin login error:", error);
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Login failed";

          throw new Error(message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      loginWithGoogle: async (credential) => {
        set({ isLoggingIn: true });

        try {
          const { data } = await axiosInstance.post("/admin/google", {
            credential,
          });

          if (data?.data?.admin) {
            set({
              authAdmin: true,
              adminData: data.data.admin,
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Google admin login error:", error);
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Unauthorized Google admin account";

          throw new Error(message);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/admin/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({ authAdmin: false, adminData: null });
        }
      },

      checkAuth: async () => {
        set({ isCheckingAdminAuth: true });

        try {
          const { data } = await axiosInstance.get("/admin/currentAdmin");

          if (data?.data?.admin) {
            set({
              authAdmin: true,
              adminData: data.data.admin,
            });
          } else {
            set({ authAdmin: false, adminData: null });
          }
        } catch (error) {
          if (error.response?.status !== 401) {
            console.error("Admin checkAuth error:", error);
          }

          set({ authAdmin: false, adminData: null });
        } finally {
          set({ isCheckingAdminAuth: false });
        }
      },
    }),
    {
      name: "admin-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
