import { LeaderboardEntry } from '../types';
import { mockFriends } from './mock-friends';
import { mockUsers } from '../mock-auth';

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: mockFriends[3].id,
    name: mockFriends[3].name,
    avatar: mockFriends[3].avatar,
    points: 8500,
    streak: 15,
    level: 9,
  },
  {
    rank: 2,
    userId: mockFriends[4].id,
    name: mockFriends[4].name,
    avatar: mockFriends[4].avatar,
    points: 7200,
    streak: 12,
    level: 8,
  },
  {
    rank: 3,
    userId: mockFriends[0].id,
    name: mockFriends[0].name,
    avatar: mockFriends[0].avatar,
    points: 6800,
    streak: 10,
    level: 7,
  },
  {
    rank: 4,
    userId: 201,
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    points: 5500,
    streak: 8,
    level: 6,
  },
  {
    rank: 5,
    userId: 202,
    name: 'Noah Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
    points: 4800,
    streak: 7,
    level: 5,
  },
  {
    rank: 6,
    userId: mockUsers[0].id, // Current user (Alex Chen)
    name: mockUsers[0].name,
    avatar: mockUsers[0].avatar,
    points: 4500,
    streak: 7,
    level: 5,
  },
  {
    rank: 7,
    userId: 203,
    name: 'Sophia Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
    points: 4200,
    streak: 6,
    level: 5,
  },
  {
    rank: 8,
    userId: 204,
    name: 'Liam Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    points: 3800,
    streak: 5,
    level: 4,
  },
  {
    rank: 9,
    userId: mockFriends[1].id,
    name: mockFriends[1].name,
    avatar: mockFriends[1].avatar,
    points: 3500,
    streak: 4,
    level: 4,
  },
  {
    rank: 10,
    userId: 205,
    name: 'Olivia Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    points: 3200,
    streak: 3,
    level: 4,
  },
];

export function getFriendsLeaderboard(friendIds: number[]): LeaderboardEntry[] {
  return mockLeaderboard.filter(entry => friendIds.includes(entry.userId));
}

export function getGlobalLeaderboard(): LeaderboardEntry[] {
  return mockLeaderboard;
}

export function getWeeklyLeaderboard(): LeaderboardEntry[] {
  // For now, return same as global but could filter by week
  return mockLeaderboard;
}

