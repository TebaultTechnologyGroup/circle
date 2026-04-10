import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { updatePassword } from "aws-amplify/auth";
import type { Schema } from "../../../amplify/data/resource";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Loader2, Bell, Lock, User } from "lucide-react";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/Errors";
import { useAuth } from "../context/AppContext";

const client = generateClient<Schema>();

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { user, profile, refreshProfile } = useAuth();

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // Notification preferences
  const [smsOnUpdate, setSmsOnUpdate] = useState(true);
  const [smsOnHelp, setSmsOnHelp] = useState(true);
  const [emailOnUpdate, setEmailOnUpdate] = useState(true);
  const [emailOnHelp, setEmailOnHelp] = useState(true);
  const [emailWeekly, setEmailWeekly] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  // Seed form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  // Load notification preferences
  useEffect(() => {
    if (!profile?.id) return;
    async function loadPrefs() {
      try {
        // NotificationPreference has a hasOne relation on UserProfile
        // We query by userProfileId
        const { data } = await client.models.NotificationPreference.list({
          filter: { userProfileId: { eq: profile!.id } },
        });
        const pref = data?.[0];
        if (pref) {
          setSmsOnUpdate(pref.smsOnUpdate ?? true);
          setSmsOnHelp(pref.smsOnHelpRequest ?? true);
          setEmailOnUpdate(pref.emailOnUpdate ?? true);
          setEmailOnHelp(pref.emailOnHelpRequest ?? true);
          setEmailWeekly(pref.emailWeeklyDigest ?? true);
        }
      } catch {
        // No prefs record yet — defaults are fine
      }
    }
    loadPrefs();
  }, [profile?.id]);

  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : (user?.email?.[0]?.toUpperCase() ?? "?");

  // ── Save Profile ───────────────────────────────────────────────────────────

  async function handleSaveProfile() {
    if (!profile?.id) return;
    setSaving(true);
    try {
      await client.models.UserProfile.update({
        id: profile.id,
        firstName,
        lastName,
        phone: phone || undefined,
      });
      await refreshProfile();
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save profile."));
    } finally {
      setSaving(false);
    }
  }

  // ── Save Notification Preferences ─────────────────────────────────────────

  async function handleSaveNotifications() {
    if (!profile?.id) return;
    setNotifSaving(true);
    try {
      // Check if a preference record already exists
      const { data } = await client.models.NotificationPreference.list({
        filter: { userProfileId: { eq: profile.id } },
      });
      const pref = data?.[0];
      const payload = {
        userProfileId: profile.id,
        smsOnUpdate,
        smsOnHelpRequest: smsOnHelp,
        emailOnUpdate,
        emailOnHelpRequest: emailOnHelp,
        emailWeeklyDigest: emailWeekly,
      };
      if (pref) {
        await client.models.NotificationPreference.update({
          id: pref.id,
          ...payload,
        });
      } else {
        await client.models.NotificationPreference.create(payload);
      }
      toast.success("Notification preferences saved.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save preferences."));
    } finally {
      setNotifSaving(false);
    }
  }

  // ── Change Password ────────────────────────────────────────────────────────

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setPwSaving(true);
    try {
      await updatePassword({ oldPassword: currentPassword, newPassword });
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change password."));
    } finally {
      setPwSaving(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">
                {firstName || lastName
                  ? `${firstName} ${lastName}`.trim()
                  : "Your Name"}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                Free Plan
              </Badge>
            </div>
          </div>

          <Separator />

          {/* ── Profile fields ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4" />
              Personal Information
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="pFirstName">First name</Label>
                <Input
                  id="pFirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="pLastName">Last name</Label>
                <Input
                  id="pLastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="pEmail">Email</Label>
              <Input
                id="pEmail"
                value={user?.email ?? ""}
                disabled
                className="bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400">
                Email cannot be changed here.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="pPhone">Phone (for SMS notifications)</Label>
              <Input
                id="pPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 404 555 0100"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} size="sm">
              {saving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : null}
              Save Profile
            </Button>
          </div>

          <Separator />

          {/* ── Notification Preferences ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bell className="w-4 h-4" />
              Notification Preferences
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "SMS: New updates",
                  value: smsOnUpdate,
                  onChange: setSmsOnUpdate,
                },
                {
                  label: "SMS: New help requests",
                  value: smsOnHelp,
                  onChange: setSmsOnHelp,
                },
                {
                  label: "Email: New updates",
                  value: emailOnUpdate,
                  onChange: setEmailOnUpdate,
                },
                {
                  label: "Email: New help requests",
                  value: emailOnHelp,
                  onChange: setEmailOnHelp,
                },
                {
                  label: "Email: Weekly digest",
                  value: emailWeekly,
                  onChange: setEmailWeekly,
                },
              ].map(({ label, value, onChange }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <Switch checked={value} onCheckedChange={onChange} />
                </div>
              ))}
            </div>
            <Button
              onClick={handleSaveNotifications}
              disabled={notifSaving}
              size="sm"
              variant="outline"
            >
              {notifSaving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : null}
              Save Preferences
            </Button>
          </div>

          <Separator />

          {/* ── Change Password ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Lock className="w-4 h-4" />
              Change Password
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="currentPw">Current password</Label>
                <Input
                  id="currentPw"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPw">New password</Label>
                <Input
                  id="newPw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={pwSaving}
              size="sm"
              variant="outline"
            >
              {pwSaving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-2" />
              ) : null}
              Change Password
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
