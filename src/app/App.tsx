import { RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./context/AppContext";
import { router } from "./routes";
import { Toaster } from "./pages/ui/sonner";
import { LoginPage } from "./pages/LoginPage";
import { Loader2, Heart } from "lucide-react";

// ── Inner app: renders login or the full router based on auth state ───────────

function InnerApp() {
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

  if (!user) {
    return <LoginPage />;
  }

  return <RouterProvider router={router} />;
}

// ── Root app: wraps everything in AuthProvider ────────────────────────────────

function App() {
  return (
    <AuthProvider>
      <InnerApp />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
