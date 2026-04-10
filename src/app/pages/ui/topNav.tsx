//import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Heart,
  FileText,
  Settings,
  Users,
  LogOut,
  User,
  LayoutGrid,
  CircleArrowLeft,
} from "lucide-react";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useAuth } from "../../context/AppContext";
import { useCircle } from "../../context/CircleContext";
import { cn } from "./utils";
import { ProfileDialog } from "./profileDialog";

export function TopNav() {
  const { user, signOut } = useAuth();
  const { currentCircle, userRole } = useCircle();

  const location = useLocation();
  const navigate = useNavigate();

  // Restoring your exact navigation buttons

  const navigation = [
    {
      name: "My Circles",
      path: "/app",
      icon: CircleArrowLeft,
      roles: [],
      requireCircle: true,
    },
    {
      name: "Dashboard",
      path: currentCircle ? `/app/circle/${currentCircle.id}` : "/app",
      icon: Heart,
      roles: [],
      requireCircle: true,
    },
    {
      name: "Updates",
      path: currentCircle ? `/app/circle/${currentCircle.id}/updates` : "/app",
      icon: FileText,
      roles: [],
      requireCircle: true,
    },
    {
      name: "Members",
      path: currentCircle ? `/app/circle/${currentCircle.id}/members` : "/app",
      icon: Users,
      roles: [],
      requireCircle: true,
    },
    {
      name: "Help",
      path: currentCircle ? `/app/circle/${currentCircle.id}/help` : "/app",
      icon: Users,
      roles: [],
      requireCircle: true,
    },
    {
      name: "Settings",
      path: currentCircle ? `/app/circle/${currentCircle.id}/settings` : "/app",
      icon: Settings,
      roles: ["CENTER", "CAREGIVER"],
      requireCircle: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: Logo & Nav Buttons */}
        <div className="flex items-center gap-8">
          <Link to="/app" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Circle
            </span>
          </Link>

          {/* Restored Navigation Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;

              // role-based access control: if the item has roles defined and the user's role is not included, don't render the button
              if (
                item.roles.length > 0 &&
                !item.roles.includes(userRole || "")
              ) {
                return null;
              }

              if (item.requireCircle && !currentCircle) {
                return null;
              }

              return (
                <Link key={item.name} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 px-3",
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-600",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Account Dropdown */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Using Button as the direct child fixes the "ref" error */}
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border shadow-sm"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {user?.firstName?.charAt(0).toUpperCase() || (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 z-[60]">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate("/app/account")}>
                <User className="mr-2 h-4 w-4" /> My Account
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/app/circles")}>
                <LayoutGrid className="mr-2 h-4 w-4" /> My Circles
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={signOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ProfileDialog open={false} onClose={() => {}} />
    </nav>
  );
}
