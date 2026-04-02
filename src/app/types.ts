export type MemberRole = 'center' | 'caregiver' | 'family' | 'friend';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  avatar?: string;
  email?: string;
  joinedAt: Date;
}

export interface Update {
  id: string;
  content: string;
  rawContent?: string;
  authorId: string;
  createdAt: Date;
  isAIGenerated: boolean;
  reactions: Reaction[];
  comments: Comment[];
}

export interface Reaction {
  id: string;
  type: 'heart' | 'pray' | 'hug' | 'strength';
  memberId: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: 'meal' | 'ride' | 'errand' | 'visit' | 'other';
  date?: Date;
  volunteerId?: string;
  status: 'open' | 'claimed' | 'completed';
  createdAt: Date;
}

export interface Circle {
  id: string;
  centerPersonId: string;
  name: string;
  description: string;
  createdAt: Date;
}
