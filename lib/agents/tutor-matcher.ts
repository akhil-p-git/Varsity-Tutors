import { TutorMatchResult, Session } from '../types';

export interface StudentProfile {
  id: number;
  name: string;
  subject?: string;
  currentPerformance?: string;
  learningStyle?: string;
}

export async function matchTutorForStudent(
  studentProfile: StudentProfile,
  recentSessions: Session[],
  learningGoals: string[] = []
): Promise<TutorMatchResult> {
  try {
    const response = await fetch('/api/ai/match-tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentProfile,
        recentSessions: recentSessions.slice(0, 5), // Last 5 sessions
        learningGoals,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error('Failed to match tutor');
    }

    return data.match;
  } catch (error) {
    console.error('Tutor matching failed:', error);
    throw error;
  }
}
