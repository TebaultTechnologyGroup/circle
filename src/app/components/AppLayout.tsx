import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Favorite,
  People,
  Description,
  VolunteerActivism,
  Circle,
  AccountCircle,
  SwapHoriz,
  Add,
  CheckCircle,
} from "@mui/icons-material";

export function AppLayout() {
  const location = useLocation();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [circleAnchor, setCircleAnchor] = useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [newCircleDialogOpen, setNewCircleDialogOpen] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    subscription: "Pro Plan",
  });

  // Mock circles data
  const [circles, setCircles] = useState([
    { id: "1", name: "Sarah's Care Circle", role: "Caregiver", active: true },
    { id: "2", name: "Mom's Support Network", role: "Family", active: false },
    { id: "3", name: "Community Care", role: "Friend", active: false },
  ]);

  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleRole, setNewCircleRole] = useState("");

  const navigation = [
    { name: "Dashboard", path: "/app", icon: Favorite },
    { name: "Circle", path: "/app/circle", icon: Circle },
    { name: "Updates", path: "/app/updates", icon: Description },
    { name: "Members", path: "/app/members", icon: People },
    { name: "Help", path: "/app/help", icon: VolunteerActivism },
  ];

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleCircleClick = (event: React.MouseEvent<HTMLElement>) => {
    setCircleAnchor(event.currentTarget);
  };

  const handleCloseMenus = () => {
    setProfileAnchor(null);
    setCircleAnchor(null);
  };

  const handleSwitchCircle = (circleId: string) => {
    setCircles(circles.map((c) => ({ ...c, active: c.id === circleId })));
    handleCloseMenus();
  };

  const handleCreateCircle = () => {
    if (newCircleName && newCircleRole) {
      const newCircle = {
        id: Date.now().toString(),
        name: newCircleName,
        role: newCircleRole,
        active: false,
      };
      setCircles([...circles, newCircle]);
      setNewCircleName("");
      setNewCircleRole("");
      setNewCircleDialogOpen(false);
      //setCircleDialogOpen(false);
    }
  };

  const handleSaveProfile = () => {
    setProfileDialogOpen(false);
    // In a real app, this would save to backend
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ bgcolor: "white" }}
      >
        <Toolbar>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Favorite sx={{ color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              Circle of Care
            </Typography>
          </Link>

          {/* Main Navigation */}
          <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
            {navigation.map((item) => {
              const isActive =
                item.path === "/app"
                  ? location.pathname === "/app"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={<Icon />}
                  sx={{
                    textTransform: "none",
                    color: isActive ? "primary.main" : "text.secondary",
                    bgcolor: isActive ? "primary.light" : "transparent",
                    "&:hover": {
                      bgcolor: isActive ? "primary.light" : "grey.100",
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    {item.name}
                  </Box>
                </Button>
              );
            })}
          </Box>

          {/* Change Circle Button */}
          <Button
            startIcon={<SwapHoriz />}
            onClick={handleCircleClick}
            sx={{ textTransform: "none", mr: 1 }}
            variant="outlined"
            size="small"
          >
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              Change Circle
            </Box>
          </Button>

          {/* Profile Button */}
          <IconButton onClick={handleProfileClick} color="primary">
            <AccountCircle />
          </IconButton>

          {/* Profile Menu */}
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleCloseMenus}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {userData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                setProfileDialogOpen(true);
                handleCloseMenus();
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              View Profile
            </MenuItem>
          </Menu>

          {/* Circle Menu */}
          <Menu
            anchorEl={circleAnchor}
            open={Boolean(circleAnchor)}
            onClose={handleCloseMenus}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{ sx: { minWidth: 280 } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Your Circles
              </Typography>
            </Box>
            <Divider />
            {circles.map((circle) => (
              <MenuItem
                key={circle.id}
                onClick={() => handleSwitchCircle(circle.id)}
                selected={circle.active}
              >
                <ListItemIcon>
                  {circle.active ? (
                    <CheckCircle fontSize="small" color="primary" />
                  ) : (
                    <Circle fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary={circle.name} secondary={circle.role} />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={() => {
                setNewCircleDialogOpen(true);
                handleCloseMenus();
              }}
            >
              <ListItemIcon>
                <Add fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create New Circle" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>

      {/* Profile Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Profile Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
                  fontSize: "2rem",
                }}
              >
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Box>
                <Typography variant="h6">{userData.name}</Typography>
                <Button size="small" sx={{ textTransform: "none" }}>
                  Change Photo
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Full Name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Subscription
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#eff6ff",
                  borderRadius: 1,
                  border: "1px solid #3b82f6",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color="primary.dark"
                >
                  {userData.subscription}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Billed monthly • Next payment: April 27, 2026
                </Typography>
              </Box>
              <Button size="small" sx={{ mt: 1, textTransform: "none" }}>
                Manage Subscription
              </Button>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Account Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ textTransform: "none", justifyContent: "flex-start" }}
                >
                  Change Password
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ textTransform: "none", justifyContent: "flex-start" }}
                >
                  Privacy Settings
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ textTransform: "none", justifyContent: "flex-start" }}
                >
                  Notification Preferences
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Circle Dialog */}
      <Dialog
        open={newCircleDialogOpen}
        onClose={() => setNewCircleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Circle</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ mt: 1 }}
          >
            Start a new circle of care for someone who needs support.
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Circle Name"
              placeholder="e.g., Dad's Recovery Circle"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
              helperText="Give your circle a meaningful name"
            />

            <TextField
              fullWidth
              select
              label="Your Role"
              value={newCircleRole}
              onChange={(e) => setNewCircleRole(e.target.value)}
              helperText="What is your relationship to the person at the center?"
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              <option value="Caregiver">Caregiver (Primary Support)</option>
              <option value="Family">Family Member</option>
              <option value="Friend">Friend</option>
            </TextField>

            <Box
              sx={{
                p: 2,
                bgcolor: "#dbeafe",
                borderRadius: 1,
                border: "1px solid #3b82f6",
              }}
            >
              <Typography variant="body2" color="primary.dark">
                <strong>Next steps:</strong> After creating your circle, you'll
                be able to add the person at the center, invite other members,
                and start sharing updates.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCircleDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCircle}
            variant="contained"
            disabled={!newCircleName || !newCircleRole}
          >
            Create Circle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
