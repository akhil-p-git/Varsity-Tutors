import { NextRequest, NextResponse } from 'next/server';
import { analyzeAndOrchestrate, AIOrchestrationResult } from '@/lib/agents/ai-orchestrator';
import { Session } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, userContext, sessionData } = body;

    if (!event || !userContext) {
      return NextResponse.json(
        { error: 'Event and userContext are required' },
        { status: 400 }
      );
    }

    const result = await analyzeAndOrchestrate(
      event,
      userContext,
      sessionData as Session | undefined
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error orchestrating:', error);
    return NextResponse.json(
      { error: 'Failed to orchestrate' },
      { status: 500 }
    );
  }
}

