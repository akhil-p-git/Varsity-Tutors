import { generatePersonalizedMessage, PersonalizationContext } from '@/lib/ai/openai-service';
import { Friend } from '@/lib/types';

export interface PersonalizedInvite {
  message: string;
  tone: 'friendly' | 'competitive' | 'encouraging' | 'casual';
}

/**
 * AI-powered personalization agent for viral loop messages
 */
export async function personalizeInviteMessage(
  sender: {
    name: string;
    role: string;
    streak?: number;
    level?: number;
  },
  recipient: Friend | null,
  loopType: 'buddy_challenge' | 'voice_room_invite' | 'tutor_spotlight' | 'proud_parent_share',
  context: {
    subject?: string;
    score?: number;
    sessionId?: string;
  }
): Promise<PersonalizedInvite> {
  try {
    const timeOfDay = getTimeOfDay();
    
    const personalizationContext: PersonalizationContext = {
      sender: {
        name: sender.name,
        role: sender.role,
        streak: sender.streak,
        level: sender.level,
      },
      recipient: recipient ? {
        name: recipient.name,
        role: 'student', // Friends are typically students
      } : undefined,
      loopType,
      sessionData: context.subject ? {
        subject: context.subject,
        score: context.score || 0,
        skillsImproved: [],
      } : undefined,
      timeOfDay,
    };

    const message = await generatePersonalizedMessage(personalizationContext);
    
    // Determine tone based on role and loop type
    let tone: PersonalizedInvite['tone'] = 'friendly';
    if (loopType === 'buddy_challenge') {
      tone = sender.role === 'student' ? 'competitive' : 'friendly';
    } else if (loopType === 'voice_room_invite') {
      tone = 'casual';
    } else if (loopType === 'proud_parent_share') {
      tone = 'encouraging';
    }

    return {
      message,
      tone,
    };
  } catch (error) {
    console.error('Error personalizing invite message:', error);
    
    // Fallback message
    return {
      message: getFallbackMessage(loopType, sender.name),
      tone: 'friendly',
    };
  }
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getFallbackMessage(
  loopType: PersonalizationContext['loopType'],
  senderName: string
): string {
  switch (loopType) {
    case 'buddy_challenge':
      return `Hey! I just completed a great session! Think you can beat my score? 🎯`;
    case 'voice_room_invite':
      return `Come join our study room! Let's learn together 🎧`;
    case 'tutor_spotlight':
      return `Need help? A tutor is available for drop-in sessions! 📚`;
    case 'proud_parent_share':
      return `So proud of my child's progress! 🌟`;
    default:
      return `Check out Varsity Tutors!`;
  }
}

