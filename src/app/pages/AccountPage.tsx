import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../context/AppContext";
import { CreditCard, History, Lock, Trash2 } from "lucide-react";

export function AccountPage() {
  const { user, profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-4">
      <div>
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Manage your personal information and history.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>First Name</Label>
              <Input defaultValue={profile?.firstName || ""} />
            </div>
            <div className="space-y-1">
              <Label>Last Name</Label>
              <Input defaultValue={profile?.lastName || ""} />
            </div>
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input defaultValue={profile?.phone || ""} />
            </div>
          </div>
          <Button className="bg-blue-600">Update Profile</Button>
        </CardContent>
      </Card>

      {/* Financial History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" /> Purchases &
              Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span>Premium Circle (Monthly)</span>
              <span className="font-medium">$9.99</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>One-time Donation</span>
              <span className="font-medium text-green-600">+$50.00</span>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto flex items-center gap-1"
            >
              <History className="w-4 h-4" /> View Full Invoice History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Lock className="w-5 h-5" /> Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
