import { Session } from '@/lib/types';
import { analyzeSession, SessionInsights } from '@/lib/ai/openai-service';

/**
 * AI-powered session intelligence agent
 * Analyzes session results and provides insights
 */
export async function analyzeSessionResults(
  sessionData: Session
): Promise<SessionInsights> {
  try {
    const insights = await analyzeSession(sessionData);
    return insights;
  } catch (error) {
    console.error('Error in session intelligence:', error);
    
    // Fallback insights
    const accuracy = Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100);
    
    return {
      strengths: [
        accuracy >= 80 ? 'Strong performance' : 'Good effort',
        'Completed all questions',
      ],
      gaps: [
        accuracy < 70 ? 'Review foundational concepts' : 'Practice advanced problems',
        'Focus on time management',
      ],
      recommendations: [
        'Continue daily practice',
        'Join a study group',
        'Review incorrect answers',
      ],
      achievementSummary: `Great work completing your ${sessionData.subject} session! You scored ${accuracy}%. Keep practicing to improve further!`,
    };
  }
}

/**
 * Generate shareable achievement summary
 */
export function generateAchievementSummary(
  sessionData: Session,
  insights: SessionInsights
): string {
  const accuracy = Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100);
  
  return `🎯 Just scored ${accuracy}% on ${sessionData.subject}! ${insights.achievementSummary}`;
}

