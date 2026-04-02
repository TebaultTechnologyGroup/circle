import { useState } from 'react';
import { mockMembers } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { UserPlus, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import { MemberRole } from '../types';

export function Members() {
  const [selectedRole, setSelectedRole] = useState<MemberRole | 'all'>('all');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<MemberRole>('friend');

  const filteredMembers = selectedRole === 'all'
    ? mockMembers
    : mockMembers.filter((m) => m.role === selectedRole);

  const getRoleColor = (role: MemberRole) => {
    switch (role) {
      case 'center':
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'caregiver':
        return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'family':
        return 'bg-gradient-to-br from-orange-500 to-amber-600';
      case 'friend':
        return 'bg-gradient-to-br from-pink-500 to-rose-600';
    }
  };

  const getRoleBadgeVariant = (role: MemberRole) => {
    switch (role) {
      case 'center':
        return 'default';
      case 'caregiver':
        return 'secondary';
      case 'family':
        return 'outline';
      case 'friend':
        return 'outline';
    }
  };

  const handleInviteMember = () => {
    if (!newMemberName || !newMemberEmail) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(`Invitation sent to ${newMemberEmail}`);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('friend');
  };

  const roleStats = {
    all: mockMembers.length,
    center: mockMembers.filter((m) => m.role === 'center').length,
    caregiver: mockMembers.filter((m) => m.role === 'caregiver').length,
    family: mockMembers.filter((m) => m.role === 'family').length,
    friend: mockMembers.filter((m) => m.role === 'friend').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Circle Members</h1>
          <p className="text-gray-600">Manage your circle of care and support</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <UserPlus className="mr-2 h-5 w-5" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Someone to the Circle</DialogTitle>
              <DialogDescription>
                Add a new member to join your circle of care and support.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role in Circle</Label>
                <Select value={newMemberRole} onValueChange={(v) => setNewMemberRole(v as MemberRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caregiver">Caregiver (Inner Circle)</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Role determines access level and proximity in the circle
                </p>
              </div>
              <Button onClick={handleInviteMember} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedRole === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('all')}
              size="sm"
            >
              <Users className="mr-2 h-4 w-4" />
              All Members ({roleStats.all})
            </Button>
            <Button
              variant={selectedRole === 'center' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('center')}
              size="sm"
            >
              Center ({roleStats.center})
            </Button>
            <Button
              variant={selectedRole === 'caregiver' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('caregiver')}
              size="sm"
            >
              Caregivers ({roleStats.caregiver})
            </Button>
            <Button
              variant={selectedRole === 'family' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('family')}
              size="sm"
            >
              Family ({roleStats.family})
            </Button>
            <Button
              variant={selectedRole === 'friend' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('friend')}
              size="sm"
            >
              Friends ({roleStats.friend})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className={`${getRoleColor(member.role)} text-white text-lg`}>
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{member.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize">
                      {member.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Joined {member.joinedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No members found with this role</p>
          </CardContent>
        </Card>
      )}

      {/* AI Summary for Late Joiners */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            New Member Onboarding
          </CardTitle>
          <CardDescription>AI-powered summaries help late joiners catch up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700">
            When someone new joins the circle, our AI automatically generates a personalized summary of:
          </p>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside ml-2">
            <li>Current situation and recent progress</li>
            <li>Key milestones and important updates</li>
            <li>Active help requests and how they can contribute</li>
            <li>Circle members and their roles</li>
          </ul>
          <Button variant="outline" className="mt-4">
            <Mail className="mr-2 h-4 w-4" />
            Preview Welcome Summary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
