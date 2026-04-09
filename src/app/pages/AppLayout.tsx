import { Outlet } from "react-router";
import { CircleProvider } from "../context/CircleContext";
import { TopNav } from "./ui/topNav";

export function AppLayout() {
  return (
    <CircleProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNav />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </CircleProvider>
  );
}
