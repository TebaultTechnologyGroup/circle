import { useState } from 'react';
import { mockMembers, mockCircle } from '../data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MemberRole } from '../types';

export function CircleView() {
  const centerPerson = mockMembers.find((m) => m.role === 'center');
  const caregivers = mockMembers.filter((m) => m.role === 'caregiver');
  const family = mockMembers.filter((m) => m.role === 'family');
  const friends = mockMembers.filter((m) => m.role === 'friend');

  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const getRoleColor = (role: MemberRole) => {
    switch (role) {
      case 'center':
        return 'from-blue-500 to-purple-600';
      case 'caregiver':
        return 'from-green-500 to-emerald-600';
      case 'family':
        return 'from-orange-500 to-amber-600';
      case 'friend':
        return 'from-pink-500 to-rose-600';
    }
  };

  const renderMemberInCircle = (
    member: typeof mockMembers[0],
    angle: number,
    radius: number,
    size: 'sm' | 'md' | 'lg'
  ) => {
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    const sizeClasses = {
      sm: 'w-12 h-12 text-sm',
      md: 'w-16 h-16 text-base',
      lg: 'w-20 h-20 text-xl',
    };

    return (
      <div
        key={member.id}
        className="absolute transition-all duration-300 hover:scale-110"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        }}
        onMouseEnter={() => setHoveredMember(member.id)}
        onMouseLeave={() => setHoveredMember(null)}
      >
        <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-lg`}>
          <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(member.role)} text-white`}>
            {member.name.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {hoveredMember === member.id && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 border border-gray-200">
            <p className="font-medium text-sm">{member.name}</p>
            <p className="text-xs text-gray-600 capitalize">{member.role}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Circle of Care</h1>
        <p className="text-gray-600">Visual representation of {mockCircle.name}</p>
      </div>

      {/* Circle Visualization */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="relative w-full aspect-square max-w-3xl mx-auto">
            {/* Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-dashed border-pink-200 opacity-50"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full border-2 border-dashed border-orange-200 opacity-50"></div>
              <div className="absolute w-[30%] h-[30%] rounded-full border-2 border-dashed border-green-200 opacity-50"></div>
            </div>

            {/* Center Person */}
            {centerPerson && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <Avatar className="w-24 h-24 border-4 border-white shadow-2xl">
                  <AvatarFallback className={`bg-gradient-to-br ${getRoleColor('center')} text-white text-2xl`}>
                    {centerPerson.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center">
                  <p className="font-semibold">{centerPerson.name}</p>
                  <Badge className="mt-1">Center</Badge>
                </div>
              </div>
            )}

            {/* Caregivers - Inner Circle */}
            {caregivers.map((member, index) => {
              const angle = (360 / caregivers.length) * index - 90;
              return renderMemberInCircle(member, angle, 120, 'md');
            })}

            {/* Family - Middle Circle */}
            {family.map((member, index) => {
              const angle = (360 / family.length) * index - 45;
              return renderMemberInCircle(member, angle, 200, 'sm');
            })}

            {/* Friends - Outer Circle */}
            {friends.map((member, index) => {
              const angle = (360 / friends.length) * index - 20;
              return renderMemberInCircle(member, angle, 280, 'sm');
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Center</CardTitle>
            <CardDescription>Person receiving support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor('center')}`}></div>
              <span className="text-sm font-medium">1 person</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Caregivers</CardTitle>
            <CardDescription>Primary support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor('caregiver')}`}></div>
              <span className="text-sm font-medium">{caregivers.length} people</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Family</CardTitle>
            <CardDescription>Extended family members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor('family')}`}></div>
              <span className="text-sm font-medium">{family.length} people</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Friends</CardTitle>
            <CardDescription>Friends and community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor('friend')}`}></div>
              <span className="text-sm font-medium">{friends.length} people</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
