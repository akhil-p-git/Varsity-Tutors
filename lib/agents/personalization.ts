import { User } from '../mock-auth';

export interface UserContext {
  user: User;
  subject?: string;
  score?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  performanceLevel?: 'high' | 'medium' | 'low';
}

export type LoopType = 'buddy_challenge' | 'voice_room_invite' | 'tutor_spotlight' | 'proud_parent_share';

/**
 * Personalizes message based on user context
 */
export function personalizeMessage(loopType: LoopType, context: UserContext): string {
  const { user, subject, score, timeOfDay, performanceLevel } = context;
  const timeGreeting = getTimeGreeting(timeOfDay);
  const perfLevel = performanceLevel || (score ? (score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low') : 'medium');

  switch (loopType) {
    case 'buddy_challenge':
      if (perfLevel === 'high') {
        return `🎉 ${timeGreeting} ${user.name}! You scored ${score}% on ${subject || 'your session'} - that's amazing! Challenge a friend and both earn 50 gems!`;
      } else if (perfLevel === 'medium') {
        return `Great job, ${user.name}! You scored ${score}% on ${subject || 'your session'}. Challenge a friend to see who can score higher!`;
      } else {
        return `Nice effort, ${user.name}! Challenge a friend and improve together. You both earn 50 gems when they complete it!`;
      }

    case 'voice_room_invite':
      return `${timeGreeting} ${user.name}! ${subject ? `${subject} voice room` : 'Voice room'} is happening now. Join ${subject ? 'your friends' : 'the community'} and study together!`;

    case 'tutor_spotlight':
      return `🌟 ${user.name}, a tutor is available in ${subject || 'the room'}! Get personalized help now.`;

    case 'proud_parent_share':
      return `👏 Your student just completed ${subject || 'a session'}! Share this achievement and celebrate together.`;

    default:
      return `Hey ${user.name}! Check this out!`;
  }
}

/**
 * Get time-based greeting
 */
function getTimeGreeting(timeOfDay?: 'morning' | 'afternoon' | 'evening'): string {
  if (timeOfDay) {
    switch (timeOfDay) {
      case 'morning':
        return 'Good morning';
      case 'afternoon':
        return 'Good afternoon';
      case 'evening':
        return 'Good evening';
    }
  }

  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Get performance level description
 */
export function getPerformanceDescription(score: number): string {
  if (score >= 90) return 'Outstanding';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Keep practicing';
}

