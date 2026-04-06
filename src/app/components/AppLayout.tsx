import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Heart,
  Users,
  FileText,
  HandHeart,
  CircleDot,
  ChevronDown,
  Plus,
  CheckCircle2,
  LogOut,
  User,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ProfileDialog } from "./ProfileDialog";
import { useAuth } from "../context/AppContext";
import { cn } from "./ui/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CircleEntry {
  id: string;
  name: string;
  role: string;
  active: boolean;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const navigation = [
  { name: "Dashboard", path: "/app", icon: Heart },
  { name: "Circle", path: "/app/circle", icon: CircleDot },
  { name: "Updates", path: "/app/updates", icon: FileText },
  { name: "Members", path: "/app/members", icon: Users },
  { name: "Help", path: "/app/help", icon: HandHeart },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [newCircleOpen, setNewCircleOpen] = useState(false);

  // Placeholder circle list — will be replaced when Circle feature is wired up
  const [circles, setCircles] = useState<CircleEntry[]>([
    {
      id: "1",
      name: "Sarah's Circle of Care",
      role: "Caregiver",
      active: true,
    },
    { id: "2", name: "Mom's Support Network", role: "Family", active: false },
  ]);

  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleRole, setNewCircleRole] = useState("");

  const activeCircle = circles.find((c) => c.active);

  const initials = user
    ? user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.email[0].toUpperCase()
    : "?";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email ?? "";

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleSwitchCircle(id: string) {
    setCircles((prev) => prev.map((c) => ({ ...c, active: c.id === id })));
  }

  function handleCreateCircle() {
    if (!newCircleName || !newCircleRole) return;
    const next: CircleEntry = {
      id: Date.now().toString(),
      name: newCircleName,
      role: newCircleRole,
      active: false,
    };
    setCircles((prev) => [...prev, next]);
    setNewCircleName("");
    setNewCircleRole("");
    setNewCircleOpen(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Circle of Care
              </span>
            </Link>

            {/* Main Navigation */}
            <nav className="flex items-center gap-1 flex-1">
              {navigation.map((item) => {
                const isActive =
                  item.path === "/app"
                    ? location.pathname === "/app"
                    : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="hidden md:block">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Switch Circle dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 hidden sm:flex"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span className="max-w-[120px] truncate text-xs">
                      {activeCircle?.name ?? "Select Circle"}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                    Your Circles
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {circles.map((circle) => (
                    <DropdownMenuItem
                      key={circle.id}
                      onClick={() => handleSwitchCircle(circle.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2
                        className={cn(
                          "w-4 h-4 shrink-0",
                          circle.active ? "text-blue-600" : "text-gray-200",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{circle.name}</p>
                        <p className="text-xs text-gray-400">{circle.role}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setNewCircleOpen(true)}
                    className="gap-2 text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Circle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Free Plan
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setProfileOpen(true)}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* ── Profile Dialog ── */}
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* ── Create New Circle Dialog ── */}
      <Dialog
        open={newCircleOpen}
        onOpenChange={(o) => !o && setNewCircleOpen(false)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create New Circle</DialogTitle>
            <DialogDescription>
              Start a circle of care for someone who needs support.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="circleName">Circle name</Label>
              <Input
                id="circleName"
                placeholder="e.g. Dad's Recovery Circle"
                value={newCircleName}
                onChange={(e) => setNewCircleName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="circleRole">Your role</Label>
              <Select value={newCircleRole} onValueChange={setNewCircleRole}>
                <SelectTrigger id="circleRole">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CENTER">
                    Center (person being supported)
                  </SelectItem>
                  <SelectItem value="CAREGIVER">Caregiver</SelectItem>
                  <SelectItem value="FAMILY">Family Member</SelectItem>
                  <SelectItem value="FRIEND">Friend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewCircleOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCircle}
              disabled={!newCircleName || !newCircleRole}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              Create Circle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
