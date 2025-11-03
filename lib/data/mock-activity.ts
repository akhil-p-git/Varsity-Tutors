import { ActivityFeedItem } from '../types';
import { mockFriends } from './mock-friends';

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: 'activity-1',
    userId: mockFriends[0].id,
    userName: mockFriends[0].name,
    userAvatar: mockFriends[0].avatar,
    action: 'completed Geometry',
    subject: 'Geometry',
    sessionId: 'session-2',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    type: 'session',
  },
  {
    id: 'activity-2',
    userId: mockFriends[1].id,
    userName: mockFriends[1].name,
    userAvatar: mockFriends[1].avatar,
    action: 'joined Algebra Voice Room',
    subject: 'Algebra',
    roomId: 'room-1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    type: 'voiceRoom',
  },
  {
    id: 'activity-3',
    userId: mockFriends[3].id,
    userName: mockFriends[3].name,
    userAvatar: mockFriends[3].avatar,
    action: 'started a 25m study session',
    subject: 'Algebra',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    type: 'study',
  },
  {
    id: 'activity-4',
    userId: mockFriends[4].id,
    userName: mockFriends[4].name,
    userAvatar: mockFriends[4].avatar,
    action: 'completed Calculus',
    subject: 'Calculus',
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    type: 'session',
  },
  {
    id: 'activity-5',
    userId: mockFriends[0].id,
    userName: mockFriends[0].name,
    userAvatar: mockFriends[0].avatar,
    action: 'challenged you to Algebra',
    subject: 'Algebra',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    type: 'challenge',
  },
  {
    id: 'activity-6',
    userId: mockFriends[2].id,
    userName: mockFriends[2].name,
    userAvatar: mockFriends[2].avatar,
    action: 'joined Geometry Voice Room',
    subject: 'Geometry',
    roomId: 'room-2',
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    type: 'voiceRoom',
  },
];

export function getActivityFeed(limit: number = 10): ActivityFeedItem[] {
  return mockActivityFeed.slice(0, limit);
}

