import { VoiceRoom } from '../types';
import { mockFriends } from './mock-friends';
import { mockUsers } from '../mock-auth';

export const mockRooms: VoiceRoom[] = [
  {
    roomId: 'room-1',
    subject: 'Algebra',
    topic: 'Graphing Linear Equations',
    participantCount: 12,
    participants: [
      {
        userId: mockUsers[0].id,
        name: mockUsers[0].name,
        avatar: mockUsers[0].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: true,
      },
      {
        userId: mockFriends[0].id,
        name: mockFriends[0].name,
        avatar: mockFriends[0].avatar,
        isSpeaking: true,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: mockFriends[1].id,
        name: mockFriends[1].name,
        avatar: mockFriends[1].avatar,
        isSpeaking: false,
        isMuted: true,
        isModerator: false,
      },
      {
        userId: mockFriends[3].id,
        name: mockFriends[3].name,
        avatar: mockFriends[3].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: mockFriends[4].id,
        name: mockFriends[4].name,
        avatar: mockFriends[4].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 201,
        name: 'Emma Wilson',
        avatar: '/avatars/user-1.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 202,
        name: 'Noah Brown',
        avatar: '/avatars/user-2.jpg',
        isSpeaking: false,
        isMuted: true,
        isModerator: false,
      },
      {
        userId: 203,
        name: 'Sophia Lee',
        avatar: '/avatars/user-3.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 204,
        name: 'Liam Garcia',
        avatar: '/avatars/user-4.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 205,
        name: 'Olivia Martinez',
        avatar: '/avatars/user-5.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 206,
        name: 'Mason Davis',
        avatar: '/avatars/user-6.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 207,
        name: 'Isabella Anderson',
        avatar: '/avatars/user-7.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
    ],
    moderator: mockUsers[0].name,
    moderatorId: mockUsers[0].id,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    maxParticipants: 50,
  },
  {
    roomId: 'room-2',
    subject: 'Geometry',
    topic: 'Triangle Properties and Proofs',
    participantCount: 8,
    participants: [
      {
        userId: mockUsers[2].id,
        name: mockUsers[2].name,
        avatar: mockUsers[2].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: true,
      },
      {
        userId: mockFriends[2].id,
        name: mockFriends[2].name,
        avatar: mockFriends[2].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 301,
        name: 'James Taylor',
        avatar: '/avatars/user-8.jpg',
        isSpeaking: true,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 302,
        name: 'Charlotte Moore',
        avatar: '/avatars/user-9.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 303,
        name: 'Benjamin White',
        avatar: '/avatars/user-10.jpg',
        isSpeaking: false,
        isMuted: true,
        isModerator: false,
      },
      {
        userId: 304,
        name: 'Amelia Harris',
        avatar: '/avatars/user-11.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 305,
        name: 'Lucas Clark',
        avatar: '/avatars/user-12.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 306,
        name: 'Harper Lewis',
        avatar: '/avatars/user-13.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
    ],
    moderator: mockUsers[2].name,
    moderatorId: mockUsers[2].id,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    maxParticipants: 50,
  },
  {
    roomId: 'room-3',
    subject: 'Calculus',
    topic: 'Derivatives and Limits',
    participantCount: 15,
    participants: [
      {
        userId: mockUsers[2].id,
        name: mockUsers[2].name,
        avatar: mockUsers[2].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: true,
      },
      {
        userId: mockFriends[4].id,
        name: mockFriends[4].name,
        avatar: mockFriends[4].avatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 401,
        name: 'Ava Walker',
        avatar: '/avatars/user-14.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 402,
        name: 'Ethan Hall',
        avatar: '/avatars/user-15.jpg',
        isSpeaking: true,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 403,
        name: 'Mia Young',
        avatar: '/avatars/user-16.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      // Add more participants...
    ],
    moderator: mockUsers[2].name,
    moderatorId: mockUsers[2].id,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    maxParticipants: 50,
  },
  {
    roomId: 'room-4',
    subject: 'Algebra',
    topic: 'Quadratic Equations Review',
    participantCount: 6,
    participants: [
      {
        userId: 501,
        name: 'Luna Adams',
        avatar: '/avatars/user-17.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: true,
      },
      {
        userId: 502,
        name: 'Aiden Turner',
        avatar: '/avatars/user-18.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 503,
        name: 'Zoe Parker',
        avatar: '/avatars/user-19.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 504,
        name: 'Jack Robinson',
        avatar: '/avatars/user-20.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 505,
        name: 'Lily Collins',
        avatar: '/avatars/user-21.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
      {
        userId: 506,
        name: 'Henry Mitchell',
        avatar: '/avatars/user-22.jpg',
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      },
    ],
    moderator: 'Luna Adams',
    moderatorId: 501,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    maxParticipants: 50,
  },
];

export function getRoomById(roomId: string): VoiceRoom | undefined {
  return mockRooms.find(room => room.roomId === roomId);
}

export function getRoomsBySubject(subject: string): VoiceRoom[] {
  return mockRooms.filter(room => room.subject === subject);
}

export function getRoomsWithFriends(friendIds: number[]): VoiceRoom[] {
  return mockRooms.filter(room =>
    room.participants.some(p => friendIds.includes(p.userId))
  );
}

