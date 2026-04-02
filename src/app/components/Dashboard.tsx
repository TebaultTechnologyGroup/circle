import { mockCircle, mockMembers, mockUpdates, mockHelpRequests } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Users, FileText, HandHeart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Dashboard() {
  const centerPerson = mockMembers.find((m) => m.role === 'center');
  const caregivers = mockMembers.filter((m) => m.role === 'caregiver');
  const recentUpdate = mockUpdates[0];
  const openHelp = mockHelpRequests.filter((h) => h.status === 'open');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {mockCircle.name}
        </h1>
        <p className="text-gray-600">{mockCircle.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Circle Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {caregivers.length} caregivers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUpdates.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockUpdates.filter((u) => u.isAIGenerated).length} AI-composed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openHelp.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockHelpRequests.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reactions</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUpdates.reduce((acc, u) => acc + u.reactions.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Showing support</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Update */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Latest Update</CardTitle>
                <CardDescription>
                  Posted {recentUpdate.createdAt.toLocaleDateString()}
                </CardDescription>
              </div>
              <Link to="/updates">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>
                  {mockMembers
                    .find((m) => m.id === recentUpdate.authorId)
                    ?.name.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {mockMembers.find((m) => m.id === recentUpdate.authorId)?.name}
                  </span>
                  {recentUpdate.isAIGenerated && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      AI-Composed
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700">{recentUpdate.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{recentUpdate.reactions.length} reactions</span>
                  <span>{recentUpdate.comments.length} comments</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center Person */}
        <Card>
          <CardHeader>
            <CardTitle>At the Center</CardTitle>
            <CardDescription>The person we're all here to support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {centerPerson?.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{centerPerson?.name}</h3>
                <p className="text-sm text-gray-600">{centerPerson?.email}</p>
                <Badge className="mt-2" variant="outline">
                  Center
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Help Needed</CardTitle>
                <CardDescription>{openHelp.length} open requests</CardDescription>
              </div>
              <Link to="/help">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openHelp.slice(0, 3).map((help) => (
                <div
                  key={help.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{help.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {help.date?.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {help.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/updates">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Post Update
              </Button>
            </Link>
            <Link to="/circle">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="mr-2 h-5 w-5" />
                View Circle
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <HandHeart className="mr-2 h-5 w-5" />
                Offer Help
              </Button>
            </Link>
            <Link to="/members">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="mr-2 h-5 w-5" />
                Invite Member
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
