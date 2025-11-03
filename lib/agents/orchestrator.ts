import { useStore } from '../store';
import { useAuth } from '../auth-context';

export type ViralLoopType = 'buddy_challenge' | 'voice_room_invite' | 'tutor_spotlight' | 'proud_parent_share';

export interface AgentDecision {
  shouldTrigger: boolean;
  reason: string;
  loopType: ViralLoopType | null;
  throttled?: boolean;
  cooldown?: boolean;
}

interface TriggerContext {
  userId: number;
  event: string;
  data?: any;
}

// In-memory tracking (in production, use Redis/database)
const dailyInviteCounts: Map<number, number> = new Map();
const lastTriggerTimes: Map<string, number> = new Map(); // key: `${userId}-${loopType}`

const THROTTLE_LIMIT = 3; // max invites per day
const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Selects which viral loop to trigger based on event
 */
export function selectViralLoop(event: string, context: TriggerContext): ViralLoopType | null {
  const { data } = context;

  // Rule 1: Session completed + score > 70% → Buddy Challenge
  if (event === 'session_completed' && data?.score > 70) {
    return 'buddy_challenge';
  }

  // Rule 2: Buddy challenge accepted → Voice Room Invite
  if (event === 'buddy_challenge_accepted') {
    return 'voice_room_invite';
  }

  // Rule 3: In voice room > 15 min → Tutor Spotlight (optional)
  if (event === 'voice_room_15_min' && data?.minutesInRoom > 15) {
    return 'tutor_spotlight';
  }

  // Rule 4: Parent role + student completed session → Proud Parent Share
  if (event === 'session_completed' && data?.userRole === 'parent' && data?.studentCompleted) {
    return 'proud_parent_share';
  }

  return null;
}

/**
 * Checks if a viral loop should be triggered with throttling and cooldown
 */
export function shouldTrigger(
  userId: number,
  loopType: ViralLoopType,
  event?: string
): AgentDecision {
  const now = Date.now();
  const key = `${userId}-${loopType}`;

  // Check daily throttle
  const today = new Date().toDateString();
  const dailyKey = `${userId}-${today}`;
  const todayCount = dailyInviteCounts.get(Number(dailyKey)) || 0;

  if (todayCount >= THROTTLE_LIMIT) {
    return {
      shouldTrigger: false,
      reason: `Daily limit reached (${todayCount}/${THROTTLE_LIMIT} invites today)`,
      loopType: null,
      throttled: true,
    };
  }

  // Check cooldown
  const lastTrigger = lastTriggerTimes.get(key);
  if (lastTrigger && now - lastTrigger < COOLDOWN_MS) {
    const minutesRemaining = Math.ceil((COOLDOWN_MS - (now - lastTrigger)) / (60 * 1000));
    return {
      shouldTrigger: false,
      reason: `Cooldown active (${minutesRemaining} minutes remaining)`,
      loopType: null,
      cooldown: true,
    };
  }

  // Log decision
  const reason = `Triggering ${loopType} for user ${userId}${event ? ` (event: ${event})` : ''}`;
  
  // Update tracking
  dailyInviteCounts.set(Number(dailyKey), todayCount + 1);
  lastTriggerTimes.set(key, now);

  return {
    shouldTrigger: true,
    reason,
    loopType,
  };
}

/**
 * Reset tracking (for demo/testing)
 */
export function resetAgentTracking() {
  dailyInviteCounts.clear();
  lastTriggerTimes.clear();
}

/**
 * Get agent decision log
 */
export function getAgentLog(): Array<{ timestamp: Date; decision: AgentDecision; userId: number }> {
  // In production, this would query a log database
  return [];
}

