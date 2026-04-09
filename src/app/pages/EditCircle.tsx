import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCircle } from "../context/CircleContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource"; // Adjust path to your resource file
import { Checkbox } from "./ui/checkbox";
import { PhoneInput } from "./ui/phoneInput";

const client = generateClient<Schema>();

export function EditCircle() {
  const navigate = useNavigate();
  const { currentCircle, userRole, isLoading: contextLoading } = useCircle();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    centerFirstName: "",
    centerLastName: "",
    centerEmail: "",
    centerPhone: "",
    centerCondition: "",
    centerProfileId: "",
    isDiscoverable: true,
    requiresMemberApproval: false,
  });

  // Populate form when context loads
  useEffect(() => {
    if (currentCircle) {
      setFormData({
        name: currentCircle.name || "",
        centerFirstName: currentCircle.centerFirstName || "",
        centerLastName: currentCircle.centerLastName || "",
        centerEmail: currentCircle.centerEmail || "",
        centerPhone: currentCircle.centerPhone || "",
        centerCondition: currentCircle.centerCondition || "",
        centerProfileId: currentCircle.centerProfileId || "",
        isDiscoverable: currentCircle.isDiscoverable ?? true,
        requiresMemberApproval: currentCircle.requiresMemberApproval ?? false,
      });
    }
  }, [currentCircle]);

  // Authorization Check
  const canEdit = userRole === "CAREGIVER" || userRole === "CENTER";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCircle) return;

    setIsSaving(true);
    try {
      const { errors } = await client.models.Circle.update({
        id: currentCircle.id,
        ...formData,
      });

      if (errors) throw new Error(errors[0].message);

      toast.success("Circle settings updated");
      navigate(`/app/circle/${currentCircle.id}`);
    } catch (err) {
      toast.error("Failed to update settings");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (contextLoading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!canEdit) {
    return (
      <div className="text-center p-10">
        You do not have permission to edit this Circle.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Circle Settings</CardTitle>
          <CardDescription>
            Update the identity and contact details for the person at the center
            of this circle. This person is known as the "Center" of the Circle,
            and their information is used to identify the Circle and connect it
            to the right person. You can also update the health status or
            context for the Center, which will be visible to all members of the
            Circle. If you want to change the Center's information, it's best to
            update their user profile and link it here using the Profile ID
            field, so that the information stays in sync.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Circle Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cfn">Center First Name</Label>
                <Input
                  id="cfn"
                  value={formData.centerFirstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centerFirstName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cln">Center Last Name</Label>
                <Input
                  id="cln"
                  value={formData.centerLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, centerLastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="email">Center Email (for matching)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.centerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, centerEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Center Phone Number</Label>
                <div className="relative">
                  <PhoneInput
                    id="phone"
                    value={formData.centerPhone.replace("+1", "")} // Strip prefix for the display
                    onChange={(val) =>
                      setFormData({ ...formData, centerPhone: val })
                    }
                    placeholder="(555) 000-0000"
                    format={""}
                  />
                </div>
                <p className="text-[0.8rem] text-muted-foreground">
                  We use this to notify the Center and link their account.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="centerProfileId">
                  Profile Id for the Center of your Circle.
                </Label>
                <Input
                  disabled={formData.centerProfileId ? true : false}
                  id="centerProfileId"
                  type="text"
                  placeholder=""
                  value={formData.centerProfileId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      centerProfileId: e.target.value,
                    })
                  }
                />
                <div className="text-xs text-muted-foreground italic">
                  This is the profile ID for the person at the center of your
                  Circle. If you enter a profile ID here, the Circle will
                  automatically sync the name and contact info from that user's
                  profile, and you won't be able to edit those fields manually.
                  This is useful if the person at the center of your Circle has
                  a user profile in our system and you want to ensure their
                  information stays up to date. If left blank, you can manually
                  enter their name and contact details above.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2 py-4">
                <Label
                  htmlFor="isDiscoverable"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Is Discoverable
                </Label>
                <Checkbox
                  id="isDiscoverable"
                  checked={formData.isDiscoverable}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isDiscoverable: checked === true,
                    })
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <p className="text-sm text-muted-foreground">
                    Allow others to find this circle by searching for the
                    Center's name.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Health Status / Context</Label>
              <Textarea
                id="condition"
                placeholder="e.g. Recovering from surgery..."
                value={formData.centerCondition}
                onChange={(e) =>
                  setFormData({ ...formData, centerCondition: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-blue-600">
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(userRole === "CAREGIVER" || userRole == "CENTER") && (
        <Card className="border-red-100 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-600 text-sm">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Circle
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-red-600 italic">
            Deleting a Circle is irreversible. All information and history will
            be lost for everyone in the Circle.
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
