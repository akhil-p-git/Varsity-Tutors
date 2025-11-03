import { useStore } from './store';

export interface InviteLinkData {
  code: string;
  fromUserId: number;
  fromUserName: string;
  subject: string;
  sessionId: string;
  reward: number;
  challengeType: 'beat_score' | 'complete_subject' | 'time_challenge';
}

export interface ParsedInviteLink {
  code: string;
  from: string;
  subject: string;
  reward: number;
  sessionId?: string;
  challengeType?: string;
}

/**
 * Generates a shareable challenge link with UTM parameters
 */
export function generateChallengeLink(
  sessionId: string,
  senderId: number,
  senderName: string,
  subject: string,
  challengeType: 'beat_score' | 'complete_subject' | 'time_challenge' = 'beat_score',
  reward: number = 50
): string {
  // Generate a unique code
  const code = `BUDDY_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    code,
    from: senderName,
    fromId: senderId.toString(),
    subject,
    sessionId,
    reward: reward.toString(),
    challengeType,
    utm_source: 'buddy_challenge',
    utm_medium: 'share',
    utm_campaign: 'viral_loop',
  });

  return `${baseUrl}/invite?${params.toString()}`;
}

/**
 * Parses invite data from URL parameters
 */
export function parseInviteLink(url?: string): ParsedInviteLink | null {
  const urlToParse = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  try {
    const urlObj = new URL(urlToParse);
    const params = urlObj.searchParams;

    const code = params.get('code');
    const from = params.get('from');
    const subject = params.get('subject');
    const reward = params.get('reward');
    const sessionId = params.get('sessionId') || undefined;
    const challengeType = params.get('challengeType') || undefined;

    if (!code || !from || !subject || !reward) {
      return null;
    }

    return {
      code,
      from,
      subject,
      reward: parseInt(reward, 10),
      sessionId,
      challengeType: challengeType as 'beat_score' | 'complete_subject' | 'time_challenge' | undefined,
    };
  } catch (error) {
    console.error('Error parsing invite link:', error);
    return null;
  }
}

/**
 * Tracks link click in analytics
 */
export function trackLinkClick(inviteId: string): void {
  const { incrementAnalytics, addAgentLog } = useStore.getState();
  incrementAnalytics('invitesSent');
  
  // Track in agent logs
  addAgentLog({
    agent: 'Analytics',
    action: 'Link clicked',
    reason: `Invite link clicked: ${inviteId}`,
    status: 'triggered',
  });
  
  // In a real app, you'd send this to an analytics service
  if (typeof window !== 'undefined') {
    console.log('Tracked link click for invite:', inviteId);
  }
}

/**
 * Track funnel event
 */
export function trackFunnelEvent(event: 'link_created' | 'link_clicked' | 'signup' | 'session_completed' | 'conversion', data?: any): void {
  const { addAgentLog } = useStore.getState();
  
  addAgentLog({
    agent: 'Funnel',
    action: event,
    reason: data ? JSON.stringify(data) : 'Funnel event tracked',
    status: 'triggered',
  });
  
  if (typeof window !== 'undefined') {
    console.log(`Funnel event: ${event}`, data);
  }
}

/**
 * Generates a short code for invites
 */
export function generateInviteCode(): string {
  return `BUDDY_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

