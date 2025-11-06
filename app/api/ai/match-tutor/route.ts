import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { mockTutors } from '@/lib/data/mock-tutors';
import { TutorMatchResult } from '@/lib/types';

// Only initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  // Read body once at the beginning
  const body = await request.json();
  const { studentProfile, recentSessions, learningGoals } = body;

  try {

    // Build context for AI
    const tutorSummaries = mockTutors.map(t => ({
      id: t.id,
      name: t.name,
      subjects: t.subjects,
      specialties: t.specialties,
      teachingStyle: t.teachingStyle,
      successRate: t.successRate,
      avgImprovement: t.avgImprovement,
      learningStyles: t.learningStyles,
      studentTypes: t.studentTypes,
      availability: t.availability,
      recentWins: t.recentWins.slice(0, 2), // Include some social proof
    }));

    const prompt = `You are an expert educational psychologist and tutor matching specialist. Your goal is to find the PERFECT tutor match for this student.

## Student Profile
- Name: ${studentProfile.name}
- Subject Interest: ${studentProfile.subject || 'Not specified'}
- Current Performance: ${studentProfile.currentPerformance || 'Unknown'}
- Learning Goals: ${learningGoals?.join(', ') || 'General improvement'}

## Recent Session Data (Last 5 Sessions)
${recentSessions?.map((s: any) =>
  `- ${s.subject}: ${s.correctAnswers}/${s.questionsAnswered} correct (${Math.round((s.correctAnswers/s.questionsAnswered)*100)}%)`
).join('\n') || 'No recent sessions'}

## Available Tutors
${JSON.stringify(tutorSummaries, null, 2)}

## Your Task
Analyze the student's profile, performance patterns, and learning needs. Then:

1. **Select the BEST tutor** based on:
   - Subject match
   - Teaching style fit with student needs
   - Success rate with similar students
   - Learning style compatibility
   - Current availability
   - Proven track record (recent wins)

2. **Provide detailed reasoning** explaining:
   - Why this tutor is the best match
   - What specific qualities make them ideal
   - How their teaching style addresses student needs
   - Expected improvement trajectory

3. **Suggest 2-3 alternative tutors** as backups with brief explanations

4. **Estimate expected improvement** (percentage points over 8 weeks)

5. **Rate your confidence** (0-1) in this match

## Response Format (JSON only)
{
  "tutorId": number,
  "matchScore": number (0-100),
  "reasoning": "detailed explanation of why this tutor is perfect",
  "expectedImprovement": number (percentage points),
  "confidence": number (0-1),
  "keyStrengths": ["strength 1", "strength 2", "strength 3"],
  "alternativeTutors": [
    {
      "tutorId": number,
      "matchScore": number,
      "reason": "brief explanation"
    }
  ]
}

Respond ONLY with valid JSON. Be specific and confident in your recommendations.`;

    // Skip AI if not configured
    if (!openai) {
      throw new Error('OpenAI not configured');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert tutor matching AI. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temp for more consistent, analytical recommendations
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Enrich with full tutor data
    const matchedTutor = mockTutors.find(t => t.id === result.tutorId);
    if (!matchedTutor) {
      throw new Error('Tutor not found');
    }

    const enrichedResult: TutorMatchResult = {
      tutorId: result.tutorId,
      tutor: matchedTutor,
      matchScore: result.matchScore,
      reasoning: result.reasoning,
      expectedImprovement: result.expectedImprovement,
      confidence: result.confidence,
      alternativeTutors: result.alternativeTutors.map((alt: any) => ({
        tutorId: alt.tutorId,
        tutor: mockTutors.find(t => t.id === alt.tutorId)!,
        matchScore: alt.matchScore,
        reason: alt.reason,
      })),
    };

    return NextResponse.json({
      success: true,
      match: enrichedResult,
      keyStrengths: result.keyStrengths || [],
    });
  } catch (error) {
    console.error('Tutor matching error:', error);

    // Fallback to rule-based matching (using body already read above)
    const fallbackTutor = mockTutors.find(t =>
      t.subjects.includes(studentProfile.subject || 'Algebra') &&
      t.availability === 'available'
    ) || mockTutors[0];

    return NextResponse.json({
      success: true,
      match: {
        tutorId: fallbackTutor.id,
        tutor: fallbackTutor,
        matchScore: 75,
        reasoning: 'Matched based on subject availability and teaching experience.',
        expectedImprovement: 15,
        confidence: 0.6,
        alternativeTutors: mockTutors
          .filter(t => t.id !== fallbackTutor.id && t.availability === 'available')
          .slice(0, 2)
          .map(t => ({
            tutorId: t.id,
            tutor: t,
            matchScore: 70,
            reason: 'Alternative option with strong track record',
          })),
      },
      keyStrengths: ['Experienced', 'Available now', 'Subject specialist'],
      fallback: true,
    });
  }
}
