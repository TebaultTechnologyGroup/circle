import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getCurrentUser } from "aws-amplify/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Users, ArrowRight, Loader2, Heart } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource"; // Adjust path to your resource file

const client = generateClient<Schema>();

type CircleMembership = Schema["CircleMember"]["type"] & {
  circle?: Schema["Circle"]["type"];
};

export function CircleListView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<CircleMembership[]>([]);

  useEffect(() => {
    async function fetchMyCircles() {
      try {
        setLoading(true);
        const { userId } = await getCurrentUser();

        // Fetch memberships for the current user and include the related Circle data
        const { data: memberData } = await client.models.CircleMember.list({
          filter: { userProfileId: { eq: userId } },
          selectionSet: ["circle.*", "role", "circleId", "id"], // Ensure we get the nested circle object
        });

        setMemberships(memberData as CircleMembership[]);
      } catch (error) {
        console.error("Error loading circles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyCircles();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Circles</h1>
          <p className="text-muted-foreground">
            Select a circle to view updates or manage care.
          </p>
        </div>
        <Button
          onClick={() => navigate("/app/create-circle")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Circle
        </Button>
      </div>

      {memberships.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-xl">No Circles Found</CardTitle>
          <CardDescription className="max-w-xs mt-2">
            You haven't joined or created any circles of support yet. Start one
            now to coordinate care.
          </CardDescription>
          <Button
            onClick={() => navigate("/app/create-circle")}
            variant="outline"
            className="mt-6"
          >
            Get Started
          </Button>
        </Card>
      ) : (
        /* Grid of Circle Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((membership) => (
            <Card
              key={membership.id}
              className="hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge
                    variant={
                      membership.role === "CENTER" ? "default" : "secondary"
                    }
                  >
                    {membership.role}
                  </Badge>
                </div>
                <CardTitle className="mt-4">
                  {membership.circle?.name || "Unnamed Circle"}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  Supporting {membership.circle?.centerFirstName}{" "}
                  {membership.circle?.centerLastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="mr-2 h-4 w-4" />
                  {/* In a real app, you might fetch member counts, but for now we show the status */}
                  {membership.circle?.isActive ? "Active" : "Archived"}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50/50 p-4">
                <Link
                  to={`/app/circle/${membership.circleId}`}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between group"
                  >
                    Enter Circle
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
