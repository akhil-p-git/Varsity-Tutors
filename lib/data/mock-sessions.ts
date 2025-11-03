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
  return mockSessions.find(session => session.sessionId === id);
}

