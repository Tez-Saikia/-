import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthRoute({ children }) {
  const authUser = useAuthStore((state) => state.authUser);

  if (authUser) return <Navigate to="/" replace />;

  return children;
}
