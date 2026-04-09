import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AppLayout } from "./pages/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { CircleView } from "./pages/CircleView";
import { Updates } from "./pages/Updates";
import { Members } from "./pages/Members";
import { Help } from "./pages/Help";
import { AddCircle } from "./pages/AddCircle"; // Import your new component
import { RequireAuth, RedirectIfAuthenticated } from "./guards/AuthGuard";
import { LoginPage } from "./pages/LoginPage";
import { CircleListView } from "./pages/CircleListView";
import { CircleSettings } from "./pages/CircleSettings";
import { AccountPage } from "./pages/AccountPage";

export const router = createBrowserRouter([
  {
    Component: RedirectIfAuthenticated,
    children: [
      { path: "/", Component: LandingPage },
      { path: "login", Component: LoginPage },
    ],
  },
  {
    Component: RequireAuth,
    children: [
      {
        path: "/app",
        Component: AppLayout,
        children: [
          // GLOBAL context: No circleId
          { index: true, Component: CircleListView },
          { path: "create-circle", Component: AddCircle },
          { path: "account", Component: AccountPage },

          // CIRCLE context: Specific circleId
          {
            path: "circle/:circleId",
            children: [
              { index: true, Component: Dashboard },
              { path: "view", Component: CircleView }, // Changed from "circle" to "view" to avoid /circle/circle
              { path: "updates", Component: Updates },
              { path: "members", Component: Members },
              { path: "help", Component: Help },
              { path: "settings", Component: CircleSettings },
            ],
          },
        ],
      },
    ],
  },
]);
