import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AppContext";
import { router } from "./routes";
import { Toaster } from "./pages/ui/sonner";

// Auth-gating is now handled inside the router via RequireAuth / RedirectIfAuthenticated guards.
// App.tsx only needs to provide the AuthContext and render the router.

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
