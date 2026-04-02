import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./components/Dashboard";
import { CircleView } from "./components/CircleView";
import { Updates } from "./components/Updates";
import { Members } from "./components/Members";
import { Help } from "./components/Help";

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