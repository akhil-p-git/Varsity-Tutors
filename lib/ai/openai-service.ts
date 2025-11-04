import OpenAI from 'openai';
import { Session } from '@/lib/types';

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables. Please add it to your .env.local file.');
    }
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

export interface SessionInsights {
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  achievementSummary: string;
}

export interface PersonalizationContext {
  sender: {
    name: string;
    role: string;
    streak?: number;
    level?: number;
  };
  recipient?: {
    name: string;
    role: string;
  };
  sessionData?: {
    subject: string;
    score: number;
    skillsImproved: string[];
  };
  loopType: 'buddy_challenge' | 'voice_room_invite' | 'tutor_spotlight' | 'proud_parent_share';
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

export interface LoopRecommendation {
  loopType: 'buddy_challenge' | 'voice_room_invite' | 'tutor_spotlight' | 'proud_parent_share' | null;
  reasoning: string;
  confidence: number;
  personalizedMessage?: string;
}

/**
 * Analyze session results and generate insights
 */
export async function analyzeSession(sessionData: Session): Promise<SessionInsights> {
  try {
    const openaiClient = getOpenAIClient();
    const accuracy = Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100);
    
    const prompt = `You are an AI tutor analyzing a student's ${sessionData.subject} practice session.

Session Details:
- Subject: ${sessionData.subject}
- Score: ${sessionData.correctAnswers}/${sessionData.questionsAnswered} (${accuracy}%)
- Duration: ${sessionData.duration} minutes
- Skills Improved: ${sessionData.skillsImproved.join(', ')}

Provide a JSON response with:
1. strengths: Array of 2-3 key strengths demonstrated
2. gaps: Array of 2-3 areas needing improvement
3. recommendations: Array of 2-3 actionable next steps
4. achievementSummary: A short, motivational summary (1-2 sentences) highlighting their achievement

Be encouraging but honest. Format as JSON only.`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational AI tutor. Provide concise, actionable insights in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const insights = JSON.parse(content) as SessionInsights;
    return insights;
  } catch (error) {
    console.error('Error analyzing session:', error);
    // Fallback insights
    return {
      strengths: ['Consistent effort', 'Good problem-solving approach'],
      gaps: ['Review foundational concepts', 'Practice more challenging problems'],
      recommendations: ['Continue practicing daily', 'Focus on weak areas', 'Join study groups'],
      achievementSummary: `Great work completing your ${sessionData.subject} session! Keep up the momentum!`,
    };
  }
}

/**
 * Generate personalized message for viral loops
 */
export async function generatePersonalizedMessage(
  context: PersonalizationContext
): Promise<string> {
  try {
    const openaiClient = getOpenAIClient();
    const { sender, recipient, sessionData, loopType, timeOfDay } = context;
    
    let prompt = '';
    
    switch (loopType) {
      case 'buddy_challenge':
        prompt = `Generate a personalized, friendly challenge message from ${sender.name} (${sender.role})`;
        if (sessionData) {
          prompt += ` who just scored ${sessionData.score}% on ${sessionData.subject}`;
        }
        if (recipient) {
          prompt += ` to ${recipient.name} (${recipient.role})`;
        }
        prompt += `. Make it engaging, competitive but friendly. Include an emoji or two. Keep it under 80 characters.`;
        break;
        
      case 'voice_room_invite':
        prompt = `Generate a casual invite message from ${sender.name} to join a ${sessionData?.subject || 'study'} voice room. Make it sound fun and collaborative. Include an emoji. Keep it under 60 characters.`;
        break;
        
      case 'tutor_spotlight':
        prompt = `Generate a message highlighting tutor availability for ${sessionData?.subject || 'studies'}. Make it helpful and encouraging. Keep it under 70 characters.`;
        break;
        
      case 'proud_parent_share':
        prompt = `Generate a proud parent message sharing their child's achievement in ${sessionData?.subject || 'studies'}. Make it warm and celebratory. Include an emoji. Keep it under 90 characters.`;
        break;
    }

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative copywriter specializing in engaging, viral social messages. Keep messages short, friendly, and action-oriented.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const message = completion.choices[0]?.message?.content?.trim();
    return message || getFallbackMessage(loopType, sender.name);
  } catch (error) {
    console.error('Error generating personalized message:', error);
    return getFallbackMessage(context.loopType, context.sender.name);
  }
}

/**
 * Select optimal viral loop based on context
 */
export async function selectOptimalLoop(
  userContext: {
    userId: number;
    role: string;
    recentActivity: string[];
    streak?: number;
  },
  sessionData?: Session
): Promise<LoopRecommendation> {
  try {
    const openaiClient = getOpenAIClient();
    const prompt = `You are an AI growth strategist analyzing user engagement data.

User Context:
- Role: ${userContext.role}
- Recent Activity: ${userContext.recentActivity.join(', ')}
- Streak: ${userContext.streak || 0} days
${sessionData ? `- Latest Session: ${sessionData.subject}, ${Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100)}% score` : ''}

Available Viral Loops:
1. buddy_challenge - Challenge a friend to beat your score
2. voice_room_invite - Invite friends to join a study room
3. tutor_spotlight - Highlight tutor availability
4. proud_parent_share - Share child's achievement (parents only)

Provide JSON response with:
- loopType: one of the options above or null if none should trigger
- reasoning: brief explanation (2-3 sentences)
- confidence: number 0-100

Be strategic. Only recommend if engagement is likely.`;

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a data-driven growth strategist. Make recommendations based on engagement likelihood.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const recommendation = JSON.parse(content) as LoopRecommendation;
    
    // Generate personalized message if loop is recommended
    if (recommendation.loopType) {
      const message = await generatePersonalizedMessage({
        sender: {
          name: 'User',
          role: userContext.role,
          streak: userContext.streak,
        },
        loopType: recommendation.loopType,
        sessionData: sessionData ? {
          subject: sessionData.subject,
          score: Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100),
          skillsImproved: sessionData.skillsImproved || [],
        } : undefined,
      });
      recommendation.personalizedMessage = message;
    }

    return recommendation;
  } catch (error) {
    console.error('Error selecting optimal loop:', error);
    return {
      loopType: sessionData && Math.round((sessionData.correctAnswers / sessionData.questionsAnswered) * 100) > 70 ? 'buddy_challenge' : null,
      reasoning: 'Fallback: Using rule-based logic',
      confidence: 50,
    };
  }
}

function getFallbackMessage(
  loopType: PersonalizationContext['loopType'],
  senderName: string
): string {
  switch (loopType) {
    case 'buddy_challenge':
      return `Hey! I just crushed my session! Think you can beat that? 🎯`;
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

