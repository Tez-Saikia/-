import React, { useEffect, useRef } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import UserGallery from "./components/Gallery/UserGallery.jsx";
import Blog from "./components/Blog/Blog";
import About from "./components/About/About";
import Faqs from "./components/Faqs/Faqs";

import UserChatPage from "@/components/ChatStructure/pages/UserChatPage.jsx";
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";

import AdminLogin from "@/components/Login/AdminLogin.jsx";
import AdminChatPage from "@/components/ChatStructure/pages/AdminChatPage.jsx";
import AdminGallery from "@/components/Gallery/AdminGalleryPage/AdminGallery.jsx";

import { useAuthStore } from "@/store/useAuthStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminDashboard from "@/components/Admin/AdminDashboard.jsx";

import UserProtectedRoute from "./routes/UserProtectedRoute.jsx";

import PageLoader from "./components/PageLoader/PageLoader.jsx";
import AdminProtectedRoute from "@/routes/AdminProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

import { socket } from "@/lib/socket";

function AuthInitializer() {
  const navigate = useNavigate();
  const location = useLocation();

  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const {
    checkAuth: checkAdminAuth,
    isCheckingAdminAuth,
    isHydrated,
    adminData,
  } = useAdminAuthStore();

  const initialized = useRef(false);

  useEffect(() => {
    if (!isHydrated || initialized.current) return;

    initialized.current = true;

    const initAuth = async () => {
      console.log("🚀 Initializing auth...");

      if (location.pathname.startsWith("/admin")) {
        await checkAdminAuth();
      } else {
        await checkAuth();
      }

      console.log("👌 Auth initialization complete");
    };

    initAuth();
  }, [isHydrated]);

  useEffect(() => {
    if (isCheckingAuth || isCheckingAdminAuth || !isHydrated) return;

    if (adminData && location.pathname === "/admin/login") {
      navigate("/admin/dashboard", { replace: true });
    }

    if (authUser && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [
    adminData,
    authUser,
    location.pathname,
    isCheckingAuth,
    isCheckingAdminAuth,
    isHydrated,
  ]);

  useEffect(() => {
    const isLoggedIn = authUser || adminData;

    if (isLoggedIn && !socket.connected) {
      socket.connect();
    }

    if (!isLoggedIn && socket.connected) {
      socket.disconnect();
    }
  }, [authUser, adminData]);

  if (isCheckingAuth || isCheckingAdminAuth || !isHydrated) {
    return <PageLoader />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <AuthInitializer />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/blog", element: <Blog /> },
      { path: "/about", element: <About /> },
      { path: "/faqs", element: <Faqs /> },

      {
        path: "/chat",
        element: (
          <UserProtectedRoute>
            <UserChatPage />
          </UserProtectedRoute>
        ),
      },

      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },

      { path: "/admin/login", element: <AdminLogin /> },
      {
        path: "/admin/dashboard",
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },

      {
        path: "/admin/chat",
        element: (
          <AdminProtectedRoute>
            <AdminChatPage />
          </AdminProtectedRoute>
        ),
      },

      {
        path: "/admin/gallery",
        element: (
          <AdminProtectedRoute>
            <AdminGallery />
          </AdminProtectedRoute>
        ),
      },

      { path: "/gallery", element: <UserGallery /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
