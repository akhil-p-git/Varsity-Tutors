import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedMessage, PersonalizationContext } from '@/lib/ai/openai-service';

export async function POST(request: NextRequest) {
  try {
    const context: PersonalizationContext = await request.json();

    if (!context || !context.loopType) {
      return NextResponse.json(
        { error: 'Personalization context is required' },
        { status: 400 }
      );
    }

    const message = await generatePersonalizedMessage(context);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error personalizing message:', error);
    return NextResponse.json(
      { error: 'Failed to personalize message' },
      { status: 500 }
    );
  }
}

