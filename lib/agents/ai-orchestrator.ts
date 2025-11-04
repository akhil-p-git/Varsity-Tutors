import { Session } from '@/lib/types';
import { selectOptimalLoop, LoopRecommendation } from '@/lib/ai/openai-service';
import { useStore } from '@/lib/store';

export interface AIOrchestrationResult {
  shouldTrigger: boolean;
  loopType: LoopRecommendation['loopType'];
  reasoning: string;
  confidence: number;
  personalizedMessage?: string;
}

/**
 * AI-powered orchestrator that analyzes events and recommends viral loops
 */
export async function analyzeAndOrchestrate(
  event: string,
  userContext: {
    userId: number;
    role: string;
    name: string;
    streak?: number;
  },
  sessionData?: Session
): Promise<AIOrchestrationResult> {
  try {
    const store = useStore.getState();
    const recentActivity = store.sessions
      .slice(0, 5)
      .map(s => `${s.subject} (${Math.round((s.correctAnswers / s.questionsAnswered) * 100)}%)`);

    // Get AI recommendation
    const recommendation = await selectOptimalLoop(
      {
        userId: userContext.userId,
        role: userContext.role,
        recentActivity,
        streak: userContext.streak,
      },
      sessionData
    );

    // Log decision to analytics
    store.addAgentLog({
      agent: 'AI Orchestrator',
      action: recommendation.loopType ? `Recommended: ${recommendation.loopType}` : 'No recommendation',
      reason: recommendation.reasoning,
      status: recommendation.loopType ? 'triggered' : 'no_action',
    });

    return {
      shouldTrigger: recommendation.loopType !== null,
      loopType: recommendation.loopType,
      reasoning: recommendation.reasoning,
      confidence: recommendation.confidence,
      personalizedMessage: recommendation.personalizedMessage,
    };
  } catch (error) {
    console.error('Error in AI orchestration:', error);
    
    // Fallback to rule-based logic
    const shouldTrigger = sessionData && 
      Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100) > 70;
    
    return {
      shouldTrigger: shouldTrigger || false,
      loopType: shouldTrigger ? 'buddy_challenge' : null,
      reasoning: 'Fallback: Using rule-based logic due to AI service error',
      confidence: 50,
    };
  }
}

