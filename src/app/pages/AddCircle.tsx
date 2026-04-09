import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2, User, Users } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource"; // Adjust path to your resource file

const client = generateClient<Schema>();

export function AddCircle() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [target, setTarget] = useState<"self" | "someone_else">("someone_else");
  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
  } | null>(null);

  // Fetch current user details to pre-fill "For Myself"
  useEffect(() => {
    async function getUserData() {
      try {
        const attributes = await fetchUserAttributes();
        setUserProfile({
          firstName: attributes.given_name || "",
          lastName: attributes.family_name || "",
        });
      } catch (err) {
        console.error("Failed to fetch user attributes", err);
      }
    }
    getUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Determine names based on "For Myself" toggle
    const firstName =
      target === "self"
        ? userProfile?.firstName
        : (formData.get("centerFirstName") as string);
    const lastName =
      target === "self"
        ? userProfile?.lastName
        : (formData.get("centerLastName") as string);
    const condition = formData.get("centerCondition") as string;
    const email =
      userProfile?.email ||
      (formData.get("centerEmail") as string) ||
      undefined;
    const phoneNumber =
      userProfile?.phoneNumber ||
      (formData.get("centerPhone") as string) ||
      undefined;

    try {
      const { userId } = await getCurrentUser();

      // 1. Create the Circle
      const { data: newCircle, errors } = await client.models.Circle.create({
        name: formData.get("name") as string,
        centerFirstName: firstName || "",
        centerLastName: lastName || "",
        centerEmail: email || "",
        centerPhone: phoneNumber || "",
        centerProfileId: target === "self" ? userId : "",
        centerCondition: condition,
        ownerCognitoId: userId,
        shareToken: Math.random().toString(36).substring(2, 9),
        isDiscoverable: false,
        requiresMemberApproval: true,
        isActive: true,
      });

      if (errors) throw new Error(errors[0].message);

      // 2. Add creator with appropriate role
      if (newCircle) {
        await client.models.CircleMember.create({
          circleId: newCircle.id,
          userProfileId: userId,
          // If for self, creator is CENTER. If for someone else, creator is CAREGIVER.
          role: target === "self" ? "CENTER" : "CAREGIVER",
          displayName:
            target === "self" ? `${firstName} ${lastName}` : "Organizer",
        });

        navigate(`/app/circle/${newCircle.id}`);
      }
    } catch (err) {
      console.error("Circle creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="text-2xl">Start a Circle of Support</CardTitle>
          <CardDescription>
            This creates a private space to coordinate care and share updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Circle Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Journey with Dad"
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Who is this circle for?</Label>
              <RadioGroup
                defaultValue="someone_else"
                onValueChange={(v) => setTarget(v as any)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="self"
                    id="self"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="self"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                  >
                    <User className="mb-3 h-6 w-6" />
                    Myself
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="someone_else"
                    id="someone_else"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="someone_else"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 [&:has([data-state=checked])]:border-blue-600"
                  >
                    <Users className="mb-3 h-6 w-6" />
                    Someone Else
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {target === "someone_else" && (
              <div>
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="centerFirstName">Their First Name</Label>
                    <Input
                      id="centerFirstName"
                      name="centerFirstName"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="centerLastName">Their Last Name</Label>
                    <Input id="centerLastName" name="centerLastName" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="centerEmail">Their Email</Label>
                    <Input
                      id="centerEmail"
                      name="centerEmail"
                      type="email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="centerPhone">Their Phone Number</Label>
                    <Input
                      id="centerPhone"
                      name="centerPhone"
                      type="tel"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="centerCondition">
                Primary Reason for Support (Optional)
              </Label>
              <Input
                id="centerCondition"
                name="centerCondition"
                placeholder="e.g. Post-surgery recovery, Cancer treatment"
              />
              <p className="text-xs text-muted-foreground italic">
                This helps AI generate relevant update suggestions.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Circle"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
