import { Friend } from '../types';

export const mockFriends: Friend[] = [
  {
    id: 101,
    name: 'Jordan Kim',
    avatar: '/avatars/friend-1.jpg',
    isOnline: true,
    currentlyStudying: 'Algebra',
    streak: 7,
    level: 12,
  },
  {
    id: 102,
    name: 'Sam Patel',
    avatar: '/avatars/friend-2.jpg',
    isOnline: true,
    currentlyStudying: 'Geometry',
    streak: 3,
    level: 8,
  },
  {
    id: 103,
    name: 'Alex Morgan',
    avatar: '/avatars/friend-3.jpg',
    isOnline: false,
    currentlyStudying: null,
    streak: 5,
    level: 10,
  },
  {
    id: 104,
    name: 'Taylor Chen',
    avatar: '/avatars/friend-4.jpg',
    isOnline: true,
    currentlyStudying: 'Algebra',
    streak: 12,
    level: 15,
  },
  {
    id: 105,
    name: 'Riley Johnson',
    avatar: '/avatars/friend-5.jpg',
    isOnline: true,
    currentlyStudying: 'Calculus',
    streak: 9,
    level: 13,
  },
  {
    id: 106,
    name: 'Casey Williams',
    avatar: '/avatars/friend-6.jpg',
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

