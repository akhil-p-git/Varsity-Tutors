export interface Session {
  sessionId: string;
  subject: string;
  duration: number; // in minutes
  questionsAnswered: number;
  correctAnswers: number;
  skillsImproved: string[];
  timestamp: Date | string;
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  currentlyStudying: string | null;
  streak: number;
  level: number;
}

export interface Invite {
  id: string;
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  subject: string;
  sessionId?: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: Date | string;
  expiresAt?: Date | string;
}

export interface Rewards {
  points: number;
  gems: number;
  streak: number;
}

export interface Analytics {
  invitesSent: number;
  invitesAccepted: number;
  conversions: number; // sessions completed from invites
}

export interface RoomParticipant {
  userId: number;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isModerator: boolean;
}

export interface VoiceRoom {
  roomId: string;
  subject: string;
  topic: string;
  participantCount: number;
  participants: RoomParticipant[];
  moderator: string;
  moderatorId: number;
  createdAt: Date | string;
  maxParticipants?: number;
}

export interface VoiceRoomAnalytics {
  roomJoins: number;
  minutesListened: number;
  tutorDropins: number;
}

export interface ActivityFeedItem {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  action: string;
  subject?: string;
  roomId?: string;
  sessionId?: string;
  timestamp: Date | string;
  type: 'session' | 'voiceRoom' | 'challenge' | 'study';
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  level: number;
}
