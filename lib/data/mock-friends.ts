import { Friend } from '../types';

export const mockFriends: Friend[] = [
  {
    id: 101,
    name: 'Jordan Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    isOnline: true,
    currentlyStudying: 'Algebra',
    streak: 7,
    level: 12,
  },
  {
    id: 102,
    name: 'Sam Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    isOnline: true,
    currentlyStudying: 'Geometry',
    streak: 3,
    level: 8,
  },
  {
    id: 103,
    name: 'Alex Morgan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexM',
    isOnline: false,
    currentlyStudying: null,
    streak: 5,
    level: 10,
  },
  {
    id: 104,
    name: 'Taylor Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    isOnline: true,
    currentlyStudying: 'Algebra',
    streak: 12,
    level: 15,
  },
  {
    id: 105,
    name: 'Riley Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley',
    isOnline: true,
    currentlyStudying: 'Calculus',
    streak: 9,
    level: 13,
  },
  {
    id: 106,
    name: 'Casey Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    isOnline: false,
    currentlyStudying: null,
    streak: 2,
    level: 6,
  },
];

export function getFriendsBySubject(subject: string): Friend[] {
  return mockFriends.filter(
    friend => friend.isOnline && friend.currentlyStudying === subject
  );
}

export function getOnlineFriends(): Friend[] {
  return mockFriends.filter(friend => friend.isOnline);
}

