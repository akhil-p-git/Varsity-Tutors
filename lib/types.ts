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

export interface Tutor {
  id: number;
  name: string;
  avatar: string;
  subjects: string[];
  specialties: string[];
  teachingStyle: string;
  bio: string;
  
  // Performance metrics
  successRate: number; // 0-100
  studentsHelped: number;
  avgImprovement: number; // percentage points
  rating: number; // 0-5
  totalSessions: number;
  
  // Availability
  availability: 'available' | 'busy' | 'offline';
  nextAvailable: string | null; // e.g., "10 minutes"
  responseTime: string; // e.g., "< 5 min"
  
  // Trending
  trendingScore: number; // 0-100
  weeklyBookings: number;
  
  // Recent wins (for social proof)
  recentWins: string[];
  
  // Matching criteria
  learningStyles: string[]; // e.g., ['visual', 'hands-on', 'patient']
  studentTypes: string[]; // e.g., ['struggling', 'advanced', 'test-prep']
}

export interface TutorMatchResult {
  tutorId: number;
  tutor: Tutor;
  matchScore: number; // 0-100
  reasoning: string;
  expectedImprovement: number; // percentage points
  confidence: number; // 0-1
  alternativeTutors: Array<{
    tutorId: number;
    tutor: Tutor;
    matchScore: number;
    reason: string;
  }>;
}

export interface TutorSession {
  id: string;
  tutorId: number;
  studentId: number;
  subject: string;
  startTime: Date;
  endTime: Date;
  preScore: number;
  postScore: number;
  improvement: number;
  studentSatisfaction: number; // 1-5
  topics: string[];
}
