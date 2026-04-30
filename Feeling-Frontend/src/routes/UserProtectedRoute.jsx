import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import PageLoader from "@/components/PageLoader/PageLoader";

export default function UserProtectedRoute({ children }) {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

   if (authUser) return children;

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}