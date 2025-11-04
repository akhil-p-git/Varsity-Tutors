import { NextRequest, NextResponse } from 'next/server';
import { analyzeSession, SessionInsights } from '@/lib/ai/openai-service';
import { Session } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const sessionData: Session = await request.json();

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session data is required' },
        { status: 400 }
      );
    }

    const insights = await analyzeSession(sessionData);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error analyzing session:', error);
    return NextResponse.json(
      { error: 'Failed to analyze session' },
      { status: 500 }
    );
  }
}

