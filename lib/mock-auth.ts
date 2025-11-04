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
];

export function getUserById(id: number): User | undefined {
  return mockUsers.find(user => user.id === id);
}

