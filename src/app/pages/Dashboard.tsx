import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource"; // Adjust path to your resource file

const client = generateClient<Schema>();

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, FileText, HandHeart, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Dashboard() {
  const { circleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    circle: Schema["Circle"]["type"] | null;
    members: Schema["CircleMember"]["type"][];
    updates: Schema["Update"]["type"][];
    helpRequests: Schema["HelpRequest"]["type"][];
  }>({
    circle: null,
    members: [],
    updates: [],
    helpRequests: [],
  });

  useEffect(() => {
    if (!circleId) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Execute all requests in parallel for maximum performance
        const [circleRes, membersRes, updatesRes, helpRes] = await Promise.all([
          client.models.Circle.get({ id: circleId }),
          client.models.CircleMember.list({
            filter: { circleId: { eq: circleId } },
          }),
          client.models.Update.list({ filter: { circleId: { eq: circleId } } }),
          client.models.HelpRequest.list({
            filter: {
              circleId: { eq: circleId },
              status: { eq: "OPEN" },
            },
          }),
        ]);

        setData({
          circle: circleRes.data || null,
          members: membersRes.data || [],
          updates: updatesRes.data || [],
          helpRequests: helpRes.data || [],
        });
      } catch (error) {
        console.error("Critical error syncing dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [circleId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data.circle) return <div>Circle not found.</div>;

  const caregiversCount = data.members.filter(
    (m) => m.role === "CAREGIVER",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header - Using Real Circle Data */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {data.circle.name}
        </h1>
        <p className="text-gray-600">{data.circle.description}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Circle Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.members.length}</div>
            <p className="text-xs text-muted-foreground">
              {caregiversCount} caregivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.updates.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.updates.filter((u) => u.aiProcessed).length} AI-enhanced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Help</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.helpRequests.length}</div>
            <p className="text-xs text-muted-foreground">Active requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Update - Handling Nulls for Content */}
        {data.updates.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Latest Update</CardTitle>
                <Link to={`/circle/${circleId}/updates`}>
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>
                    {data.updates[0].authorDisplayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {data.updates[0].authorDisplayName}
                    </span>
                    {data.updates[0].aiProcessed && (
                      <Badge variant="secondary" className="text-xs">
                        AI-Enhanced
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {data.updates[0].content || data.updates[0].rawContent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Center Person - Data now comes from the Circle record itself */}
        <Card>
          <CardHeader>
            <CardTitle>At the Center</CardTitle>
            <CardDescription>{data.circle.centerCondition}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-2xl bg-primary text-white">
                  {data.circle.centerFirstName[0]}
                  {data.circle.centerLastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {data.circle.centerFirstName} {data.circle.centerLastName}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {data.circle.centerBio}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Help Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Help Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.helpRequests.slice(0, 3).map((help) => (
                <div
                  key={help.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div>
                    <p className="font-medium text-sm">{help.title}</p>
                    <p className="text-xs text-gray-600">{help.category}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Claim
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
