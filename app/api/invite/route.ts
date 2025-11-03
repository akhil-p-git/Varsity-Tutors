import { NextRequest, NextResponse } from 'next/server';
import { useStore } from '@/lib/store';
import { generateChallengeLink } from '@/lib/smart-links';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientId, recipientEmail, sessionId, senderId, senderName, subject, message } = body;

    if (!sessionId || !senderId || !senderName || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the store instance
    const store = useStore.getState();

    // Create invite record
    const inviteData = {
      fromUserId: senderId,
      fromUserName: senderName,
      toUserId: recipientId || 0, // 0 means sent via email/link
      toUserName: recipientEmail || 'Friend',
      subject,
      sessionId,
      status: 'pending' as const,
    };

    // Generate shareable link
    const inviteLink = generateChallengeLink(
      sessionId,
      senderId,
      senderName,
      subject,
      'beat_score',
      50
    );

    // Add invite to store
    store.sendInvite(inviteData);

    return NextResponse.json({
      success: true,
      invite: {
        ...inviteData,
        link: inviteLink,
        code: inviteLink.split('code=')[1]?.split('&')[0],
      },
    });
  } catch (error) {
    console.error('Error creating invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invite' },
      { status: 500 }
    );
  }
}

