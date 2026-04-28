import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore.js";
import PageLoader from "@/components/PageLoader/PageLoader.jsx";

export default function AdminProtectedRoute({ children }) {
  const authAdmin = useAdminAuthStore((s) => s.authAdmin);
  const isCheckingAdminAuth = useAdminAuthStore((s) => s.isCheckingAdminAuth);
  const isHydrated = useAdminAuthStore((s) => s.isHydrated);

  if (!isHydrated || isCheckingAdminAuth) {
    return <PageLoader />;
  }

  if (!authAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
