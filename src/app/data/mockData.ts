import { Member, Update, HelpRequest, Circle } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'center',
    email: 'sarah@example.com',
    joinedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Michael Johnson',
    role: 'caregiver',
    email: 'michael@example.com',
    joinedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Emily Chen',
    role: 'caregiver',
    email: 'emily@example.com',
    joinedAt: new Date('2024-01-02'),
  },
  {
    id: '4',
    name: 'Robert Smith',
    role: 'family',
    email: 'robert@example.com',
    joinedAt: new Date('2024-01-03'),
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    role: 'family',
    email: 'lisa@example.com',
    joinedAt: new Date('2024-01-03'),
  },
  {
    id: '6',
    name: 'David Lee',
    role: 'friend',
    email: 'david@example.com',
    joinedAt: new Date('2024-01-05'),
  },
  {
    id: '7',
    name: 'Jennifer Martinez',
    role: 'friend',
    email: 'jennifer@example.com',
    joinedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    name: 'Thomas Brown',
    role: 'friend',
    email: 'thomas@example.com',
    joinedAt: new Date('2024-01-10'),
  },
];

export const mockUpdates: Update[] = [
  {
    id: '1',
    content: "Today was a good day! Sarah had her morning physical therapy session and showed great progress with mobility exercises. She's been resting comfortably this afternoon and enjoyed a visit from her sister. Energy levels are improving steadily.",
    rawContent: "PT went well this morning. Sarah did great with the exercises. Sister visited. She's resting now. Energy better today.",
    authorId: '2',
    createdAt: new Date('2024-03-26T14:30:00'),
    isAIGenerated: true,
    reactions: [
      { id: 'r1', type: 'heart', memberId: '4' },
      { id: 'r2', type: 'strength', memberId: '6' },
      { id: 'r3', type: 'pray', memberId: '7' },
    ],
    comments: [
      {
        id: 'c1',
        content: 'So glad to hear the progress! Keep it up Sarah! 💪',
        authorId: '4',
        createdAt: new Date('2024-03-26T15:00:00'),
      },
    ],
  },
  {
    id: '2',
    content: "Yesterday brought some challenges with increased pain levels in the evening, but the medical team adjusted medications and Sarah is feeling more comfortable today. She's maintaining a positive attitude and appreciated all the kind messages from everyone.",
    rawContent: "Pain was worse yesterday evening. Meds adjusted. Feeling better now. Thanks for all the messages.",
    authorId: '3',
    createdAt: new Date('2024-03-25T10:15:00'),
    isAIGenerated: true,
    reactions: [
      { id: 'r4', type: 'hug', memberId: '5' },
      { id: 'r5', type: 'heart', memberId: '8' },
    ],
    comments: [],
  },
  {
    id: '3',
    content: "Weekly check-in with Dr. Morrison went very well this morning. Test results are showing positive trends, and the treatment plan is working as hoped. Sarah's spirits are high, and she's looking forward to the weekend when more family can visit.",
    rawContent: "Dr appt today - good news! Tests looking better. Treatment working. Excited for family visits this weekend.",
    authorId: '2',
    createdAt: new Date('2024-03-24T16:45:00'),
    isAIGenerated: true,
    reactions: [
      { id: 'r6', type: 'heart', memberId: '4' },
      { id: 'r7', type: 'heart', memberId: '5' },
      { id: 'r8', type: 'pray', memberId: '6' },
      { id: 'r9', type: 'strength', memberId: '7' },
    ],
    comments: [
      {
        id: 'c2',
        content: 'Wonderful news! Can\'t wait to visit this weekend.',
        authorId: '5',
        createdAt: new Date('2024-03-24T17:00:00'),
      },
    ],
  },
];

export const mockHelpRequests: HelpRequest[] = [
  {
    id: '1',
    title: 'Dinner for Thursday',
    description: 'Looking for someone to prepare or deliver dinner for the family (4 people). No dietary restrictions.',
    category: 'meal',
    date: new Date('2024-03-28'),
    status: 'open',
    createdAt: new Date('2024-03-26'),
  },
  {
    id: '2',
    title: 'Ride to doctor appointment',
    description: 'Need transportation to medical appointment downtown on Monday at 10 AM.',
    category: 'ride',
    date: new Date('2024-03-29'),
    volunteerId: '6',
    status: 'claimed',
    createdAt: new Date('2024-03-25'),
  },
  {
    id: '3',
    title: 'Grocery shopping',
    description: 'Help needed with grocery shopping. List will be provided.',
    category: 'errand',
    status: 'open',
    createdAt: new Date('2024-03-26'),
  },
  {
    id: '4',
    title: 'Afternoon visit',
    description: 'Sarah would love some company for tea and conversation on Saturday afternoon.',
    category: 'visit',
    date: new Date('2024-03-30'),
    volunteerId: '7',
    status: 'claimed',
    createdAt: new Date('2024-03-24'),
  },
];

export const mockCircle: Circle = {
  id: '1',
  centerPersonId: '1',
  name: "Sarah's Circle of Care",
  description: 'Supporting Sarah through her recovery journey',
  createdAt: new Date('2024-01-01'),
};
