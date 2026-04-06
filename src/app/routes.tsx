import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AppLayout } from "./pages/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { CircleView } from "./pages/CircleView";
import { Updates } from "./pages/Updates";
import { Members } from "./pages/Members";
import { Help } from "./pages/Help";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "circle", Component: CircleView },
      { path: "updates", Component: Updates },
      { path: "members", Component: Members },
      { path: "help", Component: Help },
    ],
  },
]);
