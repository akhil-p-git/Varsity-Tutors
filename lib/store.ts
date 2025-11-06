import { create } from 'zustand';
import { Session, Friend, Invite, Rewards, Analytics, VoiceRoom, VoiceRoomAnalytics, RoomParticipant, Tutor, TutorSession, TutorMatchResult, ActivityNotification } from './types';
import { mockSessions } from './data/mock-sessions';
import { mockFriends } from './data/mock-friends';
import { mockRooms } from './data/mock-rooms';
import { mockTutors } from './data/mock-tutors';
import { mockTutorSessions } from './data/mock-tutor-sessions';

interface AppState {
  // State
  sessions: Session[];
  friends: Friend[];
  invites: Invite[];
  rewards: Rewards;
  analytics: Analytics;
  activeRooms: VoiceRoom[];
  currentRoom: VoiceRoom | null;
  voiceRoomAnalytics: VoiceRoomAnalytics;
  agentLogs: Array<{ timestamp: Date; agent: string; action: string; reason: string; status: string }>;
  demoState: {
    isPlaying: boolean;
    currentStep: number;
    narration: string;
  } | null;
  tutors: Tutor[];
  tutorSessions: TutorSession[];
  recommendedTutor: TutorMatchResult | null;
  tutorAnalytics: {
    totalSessions: number;
    avgImprovement: number;
    topTutors: Tutor[];
  };
  activityNotifications: ActivityNotification[];

  // Actions
  addSession: (session: Session) => void;
  addFriend: (friend: Friend) => void;
  sendInvite: (invite: Omit<Invite, 'id' | 'createdAt'>) => void;
  acceptInvite: (inviteId: string) => void;
  completeInvite: (inviteId: string) => void;
  completeInviteByCode: (inviteCode: string) => void;
  updateRewards: (updates: Partial<Rewards>) => void;
  incrementAnalytics: (key: keyof Analytics) => void;
  
  // Voice Room Actions
  setActiveRooms: (rooms: VoiceRoom[]) => void;
  setCurrentRoom: (room: VoiceRoom | null) => void;
  joinRoom: (roomId: string, userId: number, userName: string, userAvatar: string) => void;
  leaveRoom: (roomId: string, userId: number) => void;
  updateParticipantSpeaking: (roomId: string, userId: number, isSpeaking: boolean) => void;
  toggleParticipantMute: (roomId: string, userId: number) => void;
  incrementVoiceRoomAnalytics: (key: keyof VoiceRoomAnalytics, value?: number) => void;
  addAgentLog: (log: { agent: string; action: string; reason: string; status: string }) => void;
  setDemoState: (state: { isPlaying: boolean; currentStep: number; narration: string } | null) => void;
  
  // Tutor Actions
  setRecommendedTutor: (match: TutorMatchResult | null) => void;
  addTutorSession: (session: TutorSession) => void;
  
  // Activity Notifications
  addActivityNotification: (notification: Omit<ActivityNotification, 'id' | 'timestamp'>) => void;
  removeActivityNotification: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  sessions: mockSessions,
  friends: mockFriends,
  invites: [],
  rewards: {
    points: 1250,
    gems: 340,
    streak: 5,
  },
  analytics: {
    invitesSent: 0,
    invitesAccepted: 0,
    conversions: 0,
  },
  activeRooms: mockRooms,
  currentRoom: null,
  voiceRoomAnalytics: {
    roomJoins: 0,
    minutesListened: 0,
    tutorDropins: 0,
  },
  agentLogs: [],
  demoState: null,
  tutors: mockTutors,
  tutorSessions: mockTutorSessions,
  recommendedTutor: null,
  tutorAnalytics: (() => {
    const totalSessions = mockTutorSessions.length;
    const avgImprovement = mockTutorSessions.length > 0
      ? mockTutorSessions.reduce((sum, session) => sum + session.improvement, 0) / mockTutorSessions.length
      : 0;
    const topTutors = [...mockTutors].sort((a, b) => b.successRate - a.successRate).slice(0, 3);
    return { totalSessions, avgImprovement, topTutors };
  })(),
  activityNotifications: [],

  // Actions
  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
    })),

  addFriend: (friend) =>
    set((state) => ({
      friends: [...state.friends, friend],
    })),

  sendInvite: (inviteData) =>
    set((state) => {
      const newInvite: Invite = {
        ...inviteData,
        id: `invite-${Date.now()}`,
        createdAt: new Date(),
        status: 'pending',
      };
      return {
        invites: [...state.invites, newInvite],
        analytics: {
          ...state.analytics,
          invitesSent: state.analytics.invitesSent + 1,
        },
      };
    }),

  acceptInvite: (inviteId) =>
    set((state) => ({
      invites: state.invites.map((invite) =>
        invite.id === inviteId ? { ...invite, status: 'accepted' } : invite
      ),
      analytics: {
        ...state.analytics,
        invitesAccepted: state.analytics.invitesAccepted + 1,
      },
    })),

  completeInvite: (inviteId) =>
    set((state) => {
      const invite = state.invites.find((inv) => inv.id === inviteId);
      if (!invite || invite.status === 'completed') return state;

      return {
        invites: state.invites.map((inv) =>
          inv.id === inviteId ? { ...inv, status: 'completed' } : inv
        ),
        rewards: {
          ...state.rewards,
          gems: state.rewards.gems + 50,
          points: state.rewards.points + 100,
        },
        analytics: {
          ...state.analytics,
          conversions: state.analytics.conversions + 1,
        },
      };
    }),

  completeInviteByCode: (inviteCode) =>
    set((state) => {
      // Find invite by matching code in the invite ID or create a new one
      const invite = state.invites.find((inv) => inv.id.includes(inviteCode));
      
      // If invite exists and is not completed, complete it
      if (invite && invite.status !== 'completed') {
        return {
          invites: state.invites.map((inv) =>
            inv.id === invite.id ? { ...inv, status: 'completed' } : inv
          ),
          rewards: {
            ...state.rewards,
            gems: state.rewards.gems + 50,
            points: state.rewards.points + 100,
          },
          analytics: {
            ...state.analytics,
            conversions: state.analytics.conversions + 1,
          },
        };
      }

      // If no invite found, still give rewards (first time completing)
      if (!invite) {
        return {
          rewards: {
            ...state.rewards,
            gems: state.rewards.gems + 50,
            points: state.rewards.points + 100,
          },
          analytics: {
            ...state.analytics,
            conversions: state.analytics.conversions + 1,
          },
        };
      }

      return state;
    }),

  updateRewards: (updates) =>
    set((state) => ({
      rewards: { ...state.rewards, ...updates },
    })),

  incrementAnalytics: (key) =>
    set((state) => ({
      analytics: {
        ...state.analytics,
        [key]: state.analytics[key] + 1,
      },
    })),

  // Voice Room Actions
  setActiveRooms: (rooms) =>
    set({ activeRooms: rooms }),

  setCurrentRoom: (room) =>
    set({ currentRoom: room }),

  joinRoom: (roomId, userId, userName, userAvatar) =>
    set((state) => {
      const room = state.activeRooms.find(r => r.roomId === roomId);
      if (!room) return state;

      const participant: RoomParticipant = {
        userId,
        name: userName,
        avatar: userAvatar,
        isSpeaking: false,
        isMuted: false,
        isModerator: false,
      };

      const updatedRoom: VoiceRoom = {
        ...room,
        participants: [...room.participants, participant],
        participantCount: room.participantCount + 1,
      };

      return {
        activeRooms: state.activeRooms.map(r => r.roomId === roomId ? updatedRoom : r),
        currentRoom: updatedRoom,
        voiceRoomAnalytics: {
          ...state.voiceRoomAnalytics,
          roomJoins: state.voiceRoomAnalytics.roomJoins + 1,
        },
      };
    }),

  leaveRoom: (roomId, userId) =>
    set((state) => {
      const room = state.activeRooms.find(r => r.roomId === roomId);
      if (!room) return state;

      const updatedRoom: VoiceRoom = {
        ...room,
        participants: room.participants.filter(p => p.userId !== userId),
        participantCount: Math.max(0, room.participantCount - 1),
      };

      return {
        activeRooms: state.activeRooms.map(r => r.roomId === roomId ? updatedRoom : r),
        currentRoom: state.currentRoom?.roomId === roomId ? null : state.currentRoom,
      };
    }),

  updateParticipantSpeaking: (roomId, userId, isSpeaking) =>
    set((state) => {
      const room = state.activeRooms.find(r => r.roomId === roomId);
      if (!room) return state;

      const updatedRoom: VoiceRoom = {
        ...room,
        participants: room.participants.map(p =>
          p.userId === userId ? { ...p, isSpeaking } : p
        ),
      };

      return {
        activeRooms: state.activeRooms.map(r => r.roomId === roomId ? updatedRoom : r),
        currentRoom: state.currentRoom?.roomId === roomId ? updatedRoom : state.currentRoom,
      };
    }),

  toggleParticipantMute: (roomId, userId) =>
    set((state) => {
      const room = state.activeRooms.find(r => r.roomId === roomId);
      if (!room) return state;

      const updatedRoom: VoiceRoom = {
        ...room,
        participants: room.participants.map(p =>
          p.userId === userId ? { ...p, isMuted: !p.isMuted } : p
        ),
      };

      return {
        activeRooms: state.activeRooms.map(r => r.roomId === roomId ? updatedRoom : r),
        currentRoom: state.currentRoom?.roomId === roomId ? updatedRoom : state.currentRoom,
      };
    }),

  incrementVoiceRoomAnalytics: (key, value = 1) =>
    set((state) => ({
      voiceRoomAnalytics: {
        ...state.voiceRoomAnalytics,
        [key]: state.voiceRoomAnalytics[key] + value,
      },
    })),

  addAgentLog: (log) =>
    set((state) => ({
      agentLogs: [
        {
          timestamp: new Date(),
          ...log,
        },
        ...state.agentLogs,
      ].slice(0, 100), // Keep last 100 logs
    })),

  setDemoState: (state) =>
    set({ demoState: state }),
  
  // Tutor Actions
  setRecommendedTutor: (match) =>
    set({ recommendedTutor: match }),
  
  addTutorSession: (session) =>
    set((state) => {
      const newSessions = [session, ...state.tutorSessions];
      const avgImprovement = newSessions.length > 0
        ? newSessions.reduce((sum, s) => sum + s.improvement, 0) / newSessions.length
        : 0;
      return {
        tutorSessions: newSessions,
        tutorAnalytics: {
          ...state.tutorAnalytics,
          totalSessions: newSessions.length,
          avgImprovement,
        },
      };
    }),
  
  // Activity Notifications
  addActivityNotification: (notification) =>
    set((state) => {
      const newNotification: ActivityNotification = {
        ...notification,
        id: `activity-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      };
      
      // Keep max 5 notifications, remove oldest if needed
      const updatedNotifications = [newNotification, ...state.activityNotifications].slice(0, 5);
      
      return {
        activityNotifications: updatedNotifications,
      };
    }),
  
  removeActivityNotification: (id) =>
    set((state) => ({
      activityNotifications: state.activityNotifications.filter(n => n.id !== id),
    })),
}));

