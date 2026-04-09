import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AppContext";
import { Loader2, Heart } from "lucide-react";

// ── Protects /app/* — redirects to "/" if not authenticated ──────────────────

export function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

// ── Redirects authenticated users away from "/" to "/app" ────────────────────

export function RedirectIfAuthenticated() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      </div>
    );
  }

  return user ? <Navigate to="/app" replace /> : <Outlet />;
}
