export type UserRole = 'student' | 'parent' | 'tutor';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar: string;
  subject?: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    subject: 'Algebra',
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  },
  {
    id: 3,
    name: 'Dr. Smith',
    role: 'tutor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrSmith',
    subject: 'Algebra',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    subject: 'Geometry',
  },
  {
    id: 5,
    name: 'Kevin Park',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
    subject: 'Calculus',
  },
  {
    id: 6,
    name: 'Emily Davis',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
  {
    id: 7,
    name: 'Prof. Williams',
    role: 'tutor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Williams',
    subject: 'Physics',
  },
  {
    id: 8,
    name: 'Ms. Thompson',
    role: 'tutor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thompson',
    subject: 'Chemistry',
  },
  {
    id: 9,
    name: 'Marcus Lee',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    subject: 'Statistics',
  },
  {
    id: 10,
    name: 'Robert Garcia',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
  },
];

export function getUserById(id: number): User | undefined {
  return mockUsers.find(user => user.id === id);
}

