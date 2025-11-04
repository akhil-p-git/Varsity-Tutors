import { Session } from '../types';

export const mockSessions: Session[] = [
  {
    sessionId: 'session-1',
    subject: 'Algebra',
    duration: 45,
    questionsAnswered: 20,
    correctAnswers: 16,
    skillsImproved: ['Linear Equations', 'Graphing'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    sessionId: 'session-2',
    subject: 'Geometry',
    duration: 30,
    questionsAnswered: 15,
    correctAnswers: 12,
    skillsImproved: ['Triangles', 'Area Calculations'],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    sessionId: 'session-3',
    subject: 'Algebra',
    duration: 60,
    questionsAnswered: 25,
    correctAnswers: 22,
    skillsImproved: ['Quadratic Equations', 'Factoring', 'Graphing'],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export function getSessionById(id: string): Session | undefined {
  // First check mock sessions
  const mockSession = mockSessions.find(session => session.sessionId === id);
  if (mockSession) {
    return mockSession;
  }
  
  // If not found, check the Zustand store (for dynamically added sessions)
  if (typeof window !== 'undefined') {
    try {
      const { useStore } = require('../store');
      const sessions = useStore.getState().sessions;
      return sessions.find((session: Session) => session.sessionId === id);
    } catch (error) {
      // If store isn't available, return undefined
      return undefined;
    }
  }
  
  return undefined;
}

